import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../src/domain/repositories/user.repository';
import { AuthService } from '../../src/domain/services/auth.service';
import { RegisterRequestDto } from '../application/dto/request/register.dto';
import { AuthResponseDto } from '../application/dto/response/response-custom.dto';
import { UserRepositorySymbol } from '../../src/domain/repositories/user.repository';
import { AuthServiceSymbol } from '../../src/domain/services/auth.service';
import { UserAlreadyExistsException } from '../application/exceptions/user-exists.exception';
import { HttpStatusResponse } from '../../src/domain/constants/http-code';
import { DomainSuccessMessages } from '../../src/domain/constants/messages';
import { User } from '../../src/domain/user.entity';

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
      roles: 'user', // o el rol que definas por defecto
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
