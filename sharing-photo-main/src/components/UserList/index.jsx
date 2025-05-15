import React from 'react';
import { List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import  models from '../../modelData/models';

function UserList() {
  const users = models.userListModel();

  return (
    <List>
      {users.map((user, index) => (
        <React.Fragment key={user._id}>
          <ListItem
            component={Link}
            to={`/users/${user._id}`}
            button
          >
            <ListItemText primary={`${user.first_name} ${user.last_name}`} />
          </ListItem>
          {index < users.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
}

export default UserList;