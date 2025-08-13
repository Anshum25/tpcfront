import { Request, Response } from 'express';
import TextBlock from '../models/TextBlock';

export const getAllTextBlocks = async (_req: Request, res: Response) => {
  try {
    const blocks = await TextBlock.find();
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch text blocks' });
  }
};

export const createTextBlock = async (req: Request, res: Response) => {
  try {
    const { title, value } = req.body;
    const block = new TextBlock({ title, value });
    await block.save();
    res.status(201).json(block);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create text block' });
  }
};

export const updateTextBlock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, value } = req.body;
    const block = await TextBlock.findByIdAndUpdate(id, { title, value }, { new: true });
    if (!block) return res.status(404).json({ error: 'Text block not found' });
    res.json(block);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update text block' });
  }
};

export const deleteTextBlock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const block = await TextBlock.findByIdAndDelete(id);
    if (!block) return res.status(404).json({ error: 'Text block not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete text block' });
  }
}; 