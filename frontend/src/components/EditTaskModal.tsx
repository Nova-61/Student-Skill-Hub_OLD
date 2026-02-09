import React, { useState, useRef } from "react";
import { api } from "../api";

interface EditTaskModalProps {
  task: {
    id: number;
    title: string;
    description: string;
    price: number;
    status: string;
    city?: string;
    deadline?: string;
    importance?: string;
    skills_required?: string;
  };
  onClose: () => void;
  onSaved: () => void;
}

export default function EditTaskModal({ task, onClose, onSaved }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [price, setPrice] = useState<number>(task.price || 0);
  const [status, setStatus] = useState(task.status || "open");
  const [city, setCity] = useState(task.city || "");
  const [deadline, setDeadline] = useState(task.deadline?.split("T")[0] || "");
  const [importance, setImportance] = useState(task.importance || "medium");
  const [skillsRequired, setSkillsRequired] = useState(task.skills_required || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles(list);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", String(price));
      formData.append("status", status);
      formData.append("city", city);
      formData.append("importance", importance);
      formData.append("skills_required", skillsRequired);
      if (deadline) formData.append("deadline", deadline);
      files.forEach((f) => formData.append("files", f));

      await api.put(`tasks/${task.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✓ Задача обновлена успешно!");
      setTimeout(() => {
        onSaved();
        onClose();
      }, 600);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || err.response?.data?.error || "Ошибка при обновлении");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 max-w-lg w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Редактировать задание</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Название</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 resize-none"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Стоимость</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Статус</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="open">Открыто</option>
                <option value="in_progress">В процессе</option>
                <option value="completed">Завершено</option>
                <option value="disputed">Спор</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Город</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Москва, СПБ..."
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Важность</label>
              <select
                value={importance}
                onChange={(e) => setImportance(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="low">Низкая</option>
                <option value="medium">Средняя</option>
                <option value="high">Высокая</option>
                <option value="critical">Критична</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Дедлайн</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Требуемые навыки</label>
            <textarea
              value={skillsRequired}
              onChange={(e) => setSkillsRequired(e.target.value)}
              placeholder="React, TypeScript, REST API..."
              className="w-full border rounded px-3 py-2 resize-none text-sm"
              rows={2}
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
            >
              Отмена
            </button>
          </div>

          {message && (
            <p className={`text-center text-sm ${message.includes("✓") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}
        </form>

        <div className="mt-3">
          <label className="block text-sm font-medium mb-1">Файлы</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-gray-200 text-xs text-gray-900 rounded hover:bg-gray-300 transition"
            >
              Добавить файлы
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFilesChange}
              className="hidden"
            />
            {files.length > 0 && <span className="text-xs text-gray-600">{files.length} файл(ов) добавлено</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
