// src/main.local.ts
import { bootstrap, BootstrapMode } from './main';
import { OrdersModule } from './order.module';

async function start() {
  const app = await bootstrap(BootstrapMode.Http, OrdersModule);
  await app.listen(process.env.PORT);
}

start();
