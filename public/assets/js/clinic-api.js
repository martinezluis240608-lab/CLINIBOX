(function () {
  'use strict';

  const endpoint = '/CLINIBOX/public/api/clinica';
  let csrfToken = '';

  async function request(url, options) {
    const response = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...options });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'No se pudo conectar con la base de datos.');
    return data;
  }

  window.clinicApi = async function (resource, payload) {
    if (!payload) {
      return request(`${endpoint}?resource=${encodeURIComponent(resource)}`, { headers: { Accept: 'application/json' } });
    }
    if (!csrfToken) {
      const session = await request(`${endpoint}?resource=csrf`, { headers: { Accept: 'application/json' } });
      csrfToken = session.token || '';
    }
    return request(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
      body: JSON.stringify(payload)
    });
  };
})();
