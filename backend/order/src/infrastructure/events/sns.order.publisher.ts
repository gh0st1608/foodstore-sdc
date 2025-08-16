import { Injectable } from '@nestjs/common';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { OrderPublisher } from '../../domain/service/event.service';

@Injectable()
export class SnsOrderPublisher implements OrderPublisher {
  private readonly client: SNSClient;
  private readonly topicArn: string;

  constructor() {
    this.client = new SNSClient({ region: process.env.REGION || 'us-east-1' });
    this.topicArn = process.env.ORDER_TOPIC_ARN!;
  }

  async publishOrderCreated(payload: any): Promise<void> {
    if (!this.topicArn) {
      throw new Error('ORDER_TOPIC_ARN not configured');
    }

    const cmd = new PublishCommand({
      TopicArn: this.topicArn,
      Message: JSON.stringify(payload),
      MessageAttributes: {
        eventType: { DataType: 'String', StringValue: payload.event },
      },
    });

    await this.client.send(cmd);
  }
}
