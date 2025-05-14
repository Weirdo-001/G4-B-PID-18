import express from 'express';
import { 
  addStockController, 
  deleteStockController, 
  getAllStockController, 
  updateStockController 
} from '../controllers/stockController.js';

const router = express.Router();

router.route("/addStock").post(addStockController);
router.route("/getStock/:userId").get(getAllStockController);
router.route("/deleteStock/:id").delete(deleteStockController);
router.route("/updateStock/:id").put(updateStockController);

export default router;
