import React from 'react';
import { Typography, Link as MuiLink } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import models from '../../modelData/models';

function UserDetail() {
  const { userId } = useParams();
  const user = models.userModel(userId);

  if (!user) {
    return <Typography>User not found</Typography>;
  }

  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h5">
        {user.first_name} {user.last_name}
      </Typography>
      <Typography>Location: {user.location}</Typography>
      <Typography>Description: {user.description}</Typography>
      <Typography>Occupation: {user.occupation}</Typography>
      <MuiLink component={Link} to={`/photos/${userId}`}>
        View {user.first_name}'s Photos
      </MuiLink>
    </div>
  );
}

export default UserDetail;