import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/repositories/user.repository';
import { AuthService } from '../domain/services/auth.service';
import { RegisterRequestDto } from '../application/dto/request/register.dto';
import { AuthResponseDto } from '../application/dto/response/response-custom.dto';
import { UserRepositorySymbol } from '../domain/repositories/user.repository';
import { AuthServiceSymbol } from '../domain/services/auth.service';
import { UserAlreadyExistsException } from '../application/exceptions/user-exists.exception';
import { HttpStatusResponse } from '../domain/constants/http-code';
import { DomainSuccessMessages } from '../domain/constants/messages';
import { User } from '../domain/user.entity';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(UserRepositorySymbol)
    private readonly userRepository: UserRepository,

    @Inject(AuthServiceSymbol)
    private readonly authService: AuthService,
  ) {}

  async execute(registerDto: RegisterRequestDto): Promise<AuthResponseDto> {
    const { email, password, fullName } = registerDto.Data.User;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new UserAlreadyExistsException();
    }

    const hashedPassword = await this.authService.hashPassword(password);

    const user = User.create({
      name: fullName,
      email,
      password: hashedPassword,
      roles: 'user',
    });

    await this.userRepository.save(user);

    const accessToken = this.authService.generateAccessToken(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    return {
      Auth: {
        accessToken,
        refreshToken,
      },
      statusCode: HttpStatusResponse.CREATED,
      message: DomainSuccessMessages.REGISTER_SUCCESS,
    };
  }
}
