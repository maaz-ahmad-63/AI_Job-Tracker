import { Router } from 'express';
import { ApplicationModel } from '../models/application.model.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { applicationSchema, applicationUpdateSchema } from '../schemas/application.schema.js';
const applicationRouter = Router();
applicationRouter.use(authMiddleware);
applicationRouter.get('/', async (req, res) => {
    const applications = await ApplicationModel.find({ userId: req.user?.userId }).sort({
        createdAt: -1
    });
    res.json(applications);
});
applicationRouter.post('/', async (req, res) => {
    const parsed = applicationSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Invalid application payload' });
        return;
    }
    const created = await ApplicationModel.create({
        ...parsed.data,
        dateApplied: new Date(parsed.data.dateApplied),
        userId: req.user?.userId
    });
    res.status(201).json(created);
});
applicationRouter.put('/:id', async (req, res) => {
    const parsed = applicationUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Invalid update payload' });
        return;
    }
    const payload = { ...parsed.data };
    if (parsed.data.dateApplied) {
        payload.dateApplied = new Date(parsed.data.dateApplied);
    }
    const updated = await ApplicationModel.findOneAndUpdate({ _id: req.params.id, userId: req.user?.userId }, payload, { new: true });
    if (!updated) {
        res.status(404).json({ message: 'Application not found' });
        return;
    }
    res.json(updated);
});
applicationRouter.patch('/:id/status', async (req, res) => {
    const status = req.body?.status;
    if (!status) {
        res.status(400).json({ message: 'Status is required' });
        return;
    }
    const updated = await ApplicationModel.findOneAndUpdate({ _id: req.params.id, userId: req.user?.userId }, { status }, { new: true });
    if (!updated) {
        res.status(404).json({ message: 'Application not found' });
        return;
    }
    res.json(updated);
});
applicationRouter.delete('/:id', async (req, res) => {
    const deleted = await ApplicationModel.findOneAndDelete({
        _id: req.params.id,
        userId: req.user?.userId
    });
    if (!deleted) {
        res.status(404).json({ message: 'Application not found' });
        return;
    }
    res.status(204).send();
});
export { applicationRouter };
