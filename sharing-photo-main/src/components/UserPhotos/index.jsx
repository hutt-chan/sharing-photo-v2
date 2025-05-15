import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Link as MuiLink,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import models from '../../modelData/models';

function UserPhotos() {
  const { userId } = useParams();
  const photos = models.photoOfUserModel(userId);

  if (!photos || photos.length === 0) {
    return <Typography>No photos found</Typography>;
  }

  return (
    <div style={{ padding: 16 }}>
      {photos.map((photo) => (
        <Card key={photo._id} style={{ marginBottom: 16 }}>
          <CardMedia
            component="img"
            image={`/images/${photo.file_name}`}
            alt="User photo"
            sx={{ width: '100%', objectFit: 'contain' }} // Giữ tỷ lệ ảnh
          />
          <CardContent>
            <Typography>
              Created: {new Date(photo.date_time).toLocaleString()}
            </Typography>
            {photo.comments && photo.comments.length > 0 && (
              <div>
                <Typography variant="h6">Comments:</Typography>
                {photo.comments.map((comment) => (
                  <div key={comment._id} style={{ marginTop: 8 }}>
                    <Typography>
                      <MuiLink
                        component={Link}
                        to={`/users/${comment.user._id}`}
                      >
                        {comment.user.first_name} {comment.user.last_name}
                      </MuiLink>{' '}
                      ({new Date(comment.date_time).toLocaleString()}):
                    </Typography>
                    <Typography>{comment.comment}</Typography>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;