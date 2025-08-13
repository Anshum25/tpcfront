import { Router } from 'express';
import {
  getAllTextBlocks,
  createTextBlock,
  updateTextBlock,
  deleteTextBlock,
} from '../controllers/textBlockController';
// import { isAuth, isAdmin } from '../middleware/auth'; // Uncomment if you have auth middleware

const router = Router();

// router.use(isAuth); // Uncomment to protect all routes
// router.use(isAdmin); // Uncomment if you want admin-only

router.get('/', getAllTextBlocks);
router.post('/', createTextBlock);
router.patch('/:id', updateTextBlock);
router.delete('/:id', deleteTextBlock);

export default router; 