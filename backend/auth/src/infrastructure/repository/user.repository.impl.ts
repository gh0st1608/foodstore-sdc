import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/user.entity';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName = 'Users';

  constructor() {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    this.docClient = DynamoDBDocumentClient.from(client);
  }

  async findByEmail(email: string): Promise<User | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { email },
    });

    const result = await this.docClient.send(command);

    const userData = result.Item;
    if (!userData) return null;

    return new User({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      password: userData.password,
      roles: userData.roles,
    });
  }

  async save(user: User): Promise<void> {
    const props = user.properties();

    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        id: props.id,
        email: props.email,
        name: props.name,
        password: props.password,
        roles: props.roles,
      },
    });

    await this.docClient.send(command);
  }
}
