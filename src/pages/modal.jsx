import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Make sure to import your Firebase Firestore instance

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const [menuItems, setMenuItems] = React.useState([]);

  // Open and close modal handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Fetch menu items from Firestore on modal open
  React.useEffect(() => {
    const fetchMenuItems = async () => {
      const querySnapshot = await getDocs(collection(db, "menuItems"));
      const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMenuItems(items); // Set the menu items in state
    };

    fetchMenuItems();
  }, [open]); // Fetch items only when the modal opens

  // Toggle available/sold out status
  const toggleAvailableStatus = async (itemId, currentStatus) => {
    const itemRef = doc(db, "menuItems", itemId); // Get the document reference for the specific item
    await updateDoc(itemRef, {
      available: !currentStatus, // Toggle the `available` status
    });

    // Update the local state to reflect the change
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, available: !currentStatus } : item
      )
    );
  };

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Menu List
          </Typography>

          <Box sx={{ mt: 2 }}>
            {/* Loop through menu items and display them */}
            {menuItems.length > 0 ? (
              menuItems.map((item) => (
                <Box key={item.id} className="flex justify-between mb-2">
                  <Typography>{item.name} (₩{item.price})</Typography>
                  <Button
                    variant="contained"
                    color={item.available ? 'primary' : 'secondary'}
                    onClick={() => toggleAvailableStatus(item.id, item.available)}
                  >
                    {item.available ? "Available" : "Sold Out"}
                  </Button>
                </Box>
              ))
            ) : (
              <Typography>No menu items available</Typography>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
