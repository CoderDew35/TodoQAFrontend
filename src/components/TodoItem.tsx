import { useState } from 'react';
import { Todo } from '../store/useTodoStore';
import { Category } from '../api/category';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, data: { title?: string; description?: string; category?: string; priority?: 'Low' | 'Medium' | 'High' }) => void;
  onDelete: (id: string) => void;
  categories: Category[];
  onAddCategory: (name: string) => Promise<void>;
}


export default function TodoItem({ todo, onUpdate, onDelete, categories, onAddCategory }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [selectedCategory, setSelectedCategory] = useState(todo.category || '');
  const [newCategory, setNewCategory] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>(todo.priority || 'Medium');

  const handleSave = async () => {
    let categoryToUse = selectedCategory;
    if (selectedCategory === '__other__') {
      if (!newCategory.trim()) {
        return;
      }
      await onAddCategory(newCategory.trim());
      categoryToUse = newCategory.trim();
      setNewCategory('');
    }
    onUpdate(todo._id, { title, description, category: categoryToUse, priority });
    setIsEditing(false);
  };

  return (
    <div
      className="border rounded p-4 mb-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      data-testid="todo-item"
      data-id={todo._id}
    >
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full border rounded p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            data-testid="edit-title"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full border rounded p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            data-testid="edit-description"
          />
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full border rounded p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              data-testid="edit-category"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
              <option value="__other__">Other...</option>
            </select>
            {selectedCategory === '__other__' && (
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category"
                className="mt-2 block w-full border rounded p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              />
            )}
          </div>
          <div>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
              className="block w-full border rounded p-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              data-testid="edit-priority"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-600 dark:bg-green-500 text-white rounded"
              data-testid="save-button"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded"
              data-testid="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100" data-testid="todo-title">
              {todo.title}
            </h3>
            {todo.description && (
              <p className="text-sm text-gray-700 dark:text-gray-300" data-testid="todo-description">
                {todo.description}
              </p>
            )}
            {todo.category && (
              <p className="text-xs text-gray-500 dark:text-gray-400" data-testid="todo-category">
                Category: {todo.category}
              </p>
            )}
            {todo.priority && (
              <p className="text-xs text-gray-500 dark:text-gray-400" data-testid="todo-priority">
                Priority: {todo.priority}
              </p>
            )}
            {/* Display created and updated times */}
            {todo.createdAt && (
              <p className="text-xs text-gray-400 dark:text-gray-500" data-testid="todo-created">
                Created: {new Date(todo.createdAt).toLocaleString()}
              </p>
            )}
            {todo.updatedAt && todo.updatedAt !== todo.createdAt && (
              <p className="text-xs text-gray-400 dark:text-gray-500" data-testid="todo-updated">
                Updated: {new Date(todo.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 bg-blue-500 dark:bg-blue-600 text-white rounded"
              data-testid="edit-button"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(todo._id)}
              className="px-2 py-1 bg-red-500 dark:bg-red-600 text-white rounded"
              data-testid="delete-button"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}