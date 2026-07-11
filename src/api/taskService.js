import api from './axios';

export const taskService = {
  /**
   * Fetch paginated events from the backend.
   * @param {number} page - 0-indexed page number
   * @param {number} size - items per page
   */
  getTasks: async (page = 0, size = 9) => {
    const response = await api.get('/tasks/page', {
      params: {
        page,
        size,
        sortBy: 'startDate',
        direction: 'asc',
      },
    });

    const raw = response.data;

    if (Array.isArray(raw)) {
      return { content: raw, totalPages: 1, totalElements: raw.length };
    }

    if (raw && Array.isArray(raw.content)) {
      return raw;
    }

    console.warn('Beklenmeyen API yaniti:', raw);
    return { content: [], totalPages: 1, totalElements: 0 };
  },

  /**
   * Fetch paginated events nearby user's location.
   */
  getNearbyTasks: async (latitude, longitude, minDistance = 0, maxDistance = 10) => {
    const response = await api.get('/tasks/nearby', {
      params: {
        latitude,
        longitude,
        minDistance,
        maxDistance,
      },
    });

    const raw = response.data;

    if (Array.isArray(raw)) {
      return { content: raw, totalPages: 1, totalElements: raw.length };
    }

    if (raw && Array.isArray(raw.content)) {
      return raw;
    }

    console.warn('Beklenmeyen API yaniti:', raw);
    return { content: [], totalPages: 1, totalElements: 0 };
  },

  /**
   * Search events via Elasticsearch endpoint.
   * @param {string} query - search query string
   */
  searchTasks: async (query) => {
    const response = await api.get('/tasks/elastic', {
      params: { keyword: query },
    });

    const raw = response.data;

    if (Array.isArray(raw)) {
      return raw;
    }

    if (raw && Array.isArray(raw.content)) {
      return raw.content;
    }

    console.warn('Beklenmeyen elastic yaniti:', raw);
    return [];
  },

  /**
   * Fetch a single event detail from /tasks/{id}.
   * @param {string|number} id - task id
   */
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Fetch currently logged-in user's tasks from /tasks/my
   */
  getMyTasks: async () => {
    const response = await api.get('/tasks/my');
    return response.data;
  },

  /**
   * Fetch tasks shared with/invited to the current user from /tasks/shared
   */
  getSharedTasks: async () => {
    const response = await api.get('/tasks/shared');
    return response.data;
  },

  /**
   * Fetch user permissions for a specific task from /tasks/{id}/my-permissions
   * @param {string|number} id - task id
   */
  getTaskPermissions: async (id) => {
    const response = await api.get(`/tasks/${id}/my-permissions`);
    return response.data;
  },

  /**
   * Delete an event by its ID.
   * @param {string|number} id - task id
   */
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Create a new event with optional files.
   * @param {{title:string, description:string, latitude:number, longitude:number, startDate:string, visibility:string, files:File[]}} payload
   */
  createTask: async (payload) => {
    const formData = new FormData();

    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('latitude', payload.latitude);
    formData.append('longitude', payload.longitude);
    formData.append('startDate', payload.startDate);
    formData.append('visibility', payload.visibility);

    payload.files.forEach(file => {
      formData.append('files', file);
    });

    const response = await api.post('http://localhost:8081/tasks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Update an existing event with optional files.
   * @param {string|number} id - task id
   * @param {{title:string, description:string, latitude:number, longitude:number, startDate:string, visibility:string, files:File[]}} payload
   */
  updateTask: async (id, payload) => {
    const formData = new FormData();

    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('latitude', payload.latitude);
    formData.append('longitude', payload.longitude);
    formData.append('startDate', payload.startDate);
    formData.append('visibility', payload.visibility);

    if (Array.isArray(payload.files)) {
      payload.files.forEach(file => {
        if (file instanceof File) {
          formData.append('files', file);
        }
      });
    }

    const response = await api.put(`/tasks/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  getTaskAllPermissions: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}/permissions`);
    return response.data;
  },

  grantPermission: async (taskId, targetUsername, permission) => {
    const response = await api.post(`/tasks/${taskId}/permissions/${targetUsername}/${permission}`);
    return response.data;
  },

  revokePermission: async (taskId, targetUsername, permission) => {
    const response = await api.delete(`/tasks/${taskId}/permissions/${targetUsername}/${permission}`);
    return response.data;
  },

  grantAllPermissions: async (taskId, targetUsername) => {
    const response = await api.post(`/tasks/${taskId}/permissions/${targetUsername}/all`);
    return response.data;
  },

  revokeAllPermissions: async (taskId, targetUsername) => {
    const response = await api.delete(`/tasks/${taskId}/permissions/${targetUsername}/all`);
    return response.data;
  },
};

function parseDateParts(rawDate) {
  const dateObject = rawDate ? new Date(rawDate) : null;
  const isValidDate = dateObject && !Number.isNaN(dateObject.getTime());

  return {
    date: isValidDate
      ? dateObject.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
      : 'Tarih belirtilmedi',
    fullDate: isValidDate
      ? dateObject.toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          weekday: 'long',
        })
      : 'Tarih belirtilmedi',
    time: isValidDate
      ? dateObject.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      : 'Saat belirtilmedi',
  };
}

function parseLocation(task) {
  const location = task.location ?? {};

  return {
    address: location.address ?? task.address ?? 'Adres bilgisi yok',
    city: location.city ?? task.city ?? location.country ?? task.country ?? 'Konum',
    country: location.country ?? task.country ?? '',
    lat: location.latitude ?? location.lat ?? task.latitude ?? task.lat ?? null,
    lng: location.longitude ?? location.lon ?? task.longitude ?? task.lng ?? task.lon ?? null,
  };
}

function parseFiles(files, fileCount = 0) {
  if (!Array.isArray(files)) {
    return Array.from({ length: fileCount }, (_, index) => ({
      id: `file-${index}`,
      name: `Dosya ${index + 1}`,
      url: null,
      type: null,
      size: null,
    }));
  }

  return files.map((file, index) => {
    if (typeof file === 'string') {
      return {
        id: file,
        name: file.split('/').pop() || `Dosya ${index + 1}`,
        url: file,
        type: null,
        size: null,
      };
    }

    const type = file.type ?? file.fileType ?? file.contentType ?? file.mimeType ?? null;
    const rawData = file.fileData ?? file.data ?? null;
    const dataUrl = rawData && type ? `data:${type};base64,${rawData}` : null;
    const url = file.url ?? file.downloadUrl ?? file.path ?? file.fileUrl ?? dataUrl;

    return {
      id: file.id ?? url ?? `file-${index}`,
      name: file.name ?? file.fileName ?? file.originalName ?? `Dosya ${index + 1}`,
      url,
      type,
      size: file.size ?? file.fileSize ?? null,
    };
  });
}

function getFileCount(task) {
  if (Array.isArray(task.files)) return task.files.length;
  return task.fileCount ?? 0;
}

/**
 * Parses a raw task object from the /tasks/page API into a shape
 * the card/map UI can consume safely.
 */
export function parseTask(task) {
  const location = parseLocation(task);
  const dateParts = parseDateParts(task.startDate);

  return {
    id: task.id,
    title: task.title ?? 'Isimsiz Etkinlik',
    desc: task.description ?? '',
    address: location.address,
    city: location.city,
    lat: location.lat,
    lng: location.lng,
    date: dateParts.date,
    time: dateParts.time,
    startDateRaw: task.startDate ?? null,
    fileCount: getFileCount(task),
    completed: task.completed ?? false,
    visibility: task.visibility ?? 'PUBLIC',
  };
}

/**
 * Parses a raw task object from the /tasks/elastic API.
 */
export function parseElasticTask(task) {
  const dateParts = parseDateParts(task.startDate);
  const location = task.location ?? {};
  const city = task.city ?? 'Konum';
  const country = task.country ?? '';
  const address = [city, country].filter(Boolean).join(', ');

  return {
    id: task.id,
    title: task.title ?? 'Isimsiz Etkinlik',
    desc: task.description ?? '',
    address: address || 'Adres bilgisi yok',
    city,
    lat: location.lat ?? null,
    lng: location.lon ?? null,
    date: dateParts.date,
    time: dateParts.time,
    startDateRaw: task.startDate ?? null,
    fileCount: Array.isArray(task.files) ? task.files.length : 0,
    completed: task.completed ?? false,
    visibility: task.visibility ?? 'PUBLIC',
    username: task.username ?? null,
  };
}

/**
 * Parses a raw task object from /tasks/{id} into a detail-friendly shape.
 */
export function parseTaskDetail(task) {
  const location = parseLocation(task);
  const dateParts = parseDateParts(task.startDate);
  const files = parseFiles(task.files, task.fileCount ?? 0);

  return {
    id: task.id,
    title: task.title ?? 'Isimsiz Etkinlik',
    desc: task.description ?? 'Aciklama eklenmemis.',
    address: location.address,
    city: location.city,
    country: location.country,
    lat: location.lat,
    lng: location.lng,
    date: dateParts.date,
    fullDate: dateParts.fullDate,
    time: dateParts.time,
    startDateRaw: task.startDate ?? null,
    endDateRaw: task.endDate ?? null,
    files,
    fileCount: files.length,
    completed: task.completed ?? false,
    visibility: task.visibility ?? 'PUBLIC',
    username: task.username ?? task.owner?.username ?? task.createdBy ?? null,
    category: task.category?.name ?? task.category ?? null,
  };
}
