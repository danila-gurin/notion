import RoomProvider from '@/components/RoomProvider';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function DocLayout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}
