import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample accounts
  const account1 = await prisma.account.create({
    data: {
      account_name: '株式会社サンプル'
    }
  });

  const account2 = await prisma.account.create({
    data: {
      account_name: 'テクノロジー株式会社'
    }
  });

  // Create sample contacts
  const contact1 = await prisma.contact.create({
    data: {
      contact_name: '田中太郎',
      account_id: account1.account_id
    }
  });

  const contact2 = await prisma.contact.create({
    data: {
      contact_name: '佐藤花子',
      account_id: account2.account_id
    }
  });

  // Create sample anken
  await prisma.anken.create({
    data: {
      anken_name: 'Webアプリケーション開発',
      contact_id: contact1.contact_id,
      detail: 'ECサイトの構築プロジェクト',
      status_code: 2,
      start_date: '2024-01-01',
      end_date: '2024-06-30',
      price: '¥5,000,000',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  });

  await prisma.anken.create({
    data: {
      anken_name: 'モバイルアプリ開発',
      contact_id: contact2.contact_id,
      detail: 'iOS/Androidアプリの開発',
      status_code: 1,
      start_date: '2024-03-01',
      end_date: '2024-12-31',
      price: '¥8,000,000',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  });

  console.log('Sample data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });