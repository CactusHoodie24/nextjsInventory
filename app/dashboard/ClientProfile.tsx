'use client';

import { CldImage } from 'next-cloudinary';


export default function ClientProfile({ session }: any) {
  return (
    <>
      <h1>{session?.user?.name}</h1>
      {session?.user?.image ? (
        <CldImage
          src={session.user.image}
          width="100"
          height="100"
          alt="User profile"
        />
      ) : (
        <p>No profile image</p>
      )}
    </>
  );
}
