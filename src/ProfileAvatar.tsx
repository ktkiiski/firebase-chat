import React from 'react';
import { Avatar } from '@material-ui/core';

interface ProfileAvatarProps {
  user: {
    displayName?: string | null;
    photoUrl?: string | null;
  },
  className?: string;
}

function ProfileAvatar({user, ...props}: ProfileAvatarProps) {
  if (user.photoUrl) {
    return <Avatar
      src={user.photoUrl}
      {...props}
    />
  }
  const letter = user.displayName && user.displayName[0] || '?'
  return <Avatar {...props}>{letter.toUpperCase()}</Avatar>;
}

export default ProfileAvatar;
