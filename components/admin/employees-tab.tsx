'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Upload,
  Loader2,
  AlertCircle,
  Download,
  X,
} from 'lucide-react';

type EmployeeRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

type Employee = {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  managerName: string | null;
  isActive: boolean;
  createdAt: string;
};

type ImportRowError = {
  line: number;
  email?: string;
  message: string;
};

type ImportCreatedUser = {
  email: string;
  name: string;
  role: string;
  tempPassword: string;
};

type ImportState = {
  inserted: number;
  users: ImportCreatedUser[];
  errors: ImportRowError[];
};

type ImportApiPayload = {
  inserted?: number;
  users?: ImportCreatedUser[];
  errors?: ImportRowError[];
  error?: string;
  rowsProcessed?: number;
};

type CreateFormState = {
  name: string;
  email: string;
  role: EmployeeRole;
  managerId: string;
};

type CreatedUser = ImportCreatedUser & { id?: string };

const roleLabels: Record<EmployeeRole, string> = {
  ADMIN: 'Administrateur',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employé',
};

const statusBadge = (isActive: boolean) =>
  isActive
    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const defaultCreateForm: CreateFormState = {
  name: '',
  email: '',
  role: 'EMPLOYEE',
  managerId: '',
};

export function EmployeesTab() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] =
    useState<CreateFormState>(defaultCreateForm);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createResult, setCreateResult] = useState<CreatedUser | null>(null);

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportState | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editForm, setEditForm] = useState<CreateFormState>(defaultCreateForm);
  const [editError, setEditError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEmployees = async (silent = false) => {
    try {
      if (silent) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch('/api/users');

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          body?.error ||
            'Impossible de charger les employés. Réessayez plus tard.'
        );
      }

      const data = (await response.json()) as Array<{
        id: string;
        name: string | null;
        email: string;
        role: EmployeeRole;
        isActive: boolean;
        createdAt: string;
        manager: { name: string | null } | null;
      }>;

      setEmployees(
        data.map((employee) => ({
          id: employee.id,
          name: employee.name ?? employee.email,
          email: employee.email,
          role: employee.role,
          managerName: employee.manager?.name ?? null,
          isActive: employee.isActive,
          createdAt: employee.createdAt,
        }))
      );
    } catch (err) {
      console.error('Failed to load employees', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue. Réessayez plus tard.'
      );
    } finally {
      if (silent) {
        setIsRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const managerOptions = useMemo(
    () => employees.filter((employee) => employee.role === 'MANAGER'),
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return employees;

    return employees.filter((employee) => {
      const manager = employee.managerName?.toLowerCase() ?? '';
      return (
        employee.name.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        manager.includes(term)
      );
    });
  }, [search, employees]);

  const openImportDialog = () => {
    setSelectedFile(null);
    setImportError(null);
    setImportResult(null);
    setIsImportOpen(true);
  };

  const openCreateDialog = () => {
    setIsCreateOpen(true);
    setCreateForm(defaultCreateForm);
    setCreateError(null);
    setCreateResult(null);
  };

  const closeCreateDialog = () => {
    setIsCreateOpen(false);
    setCreateForm(defaultCreateForm);
    setCreateError(null);
    setCreateResult(null);
  };

  const handleCreateChange = <Key extends keyof CreateFormState>(
    key: Key,
    value: CreateFormState[Key]
  ) => {
    setCreateForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCreateSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!createForm.name.trim() || !createForm.email.trim()) {
      setCreateError('Nom et email sont requis.');
      return;
    }

    try {
      setIsCreating(true);
      setCreateError(null);

      const payload = {
        name: createForm.name.trim(),
        email: createForm.email.trim(),
        role: createForm.role,
        managerId: createForm.managerId ? createForm.managerId : undefined,
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => null)) as
        | (CreatedUser & { error?: string })
        | null;

      if (!body) {
        throw new Error('Réponse invalide du serveur.');
      }

      if (!response.ok) {
        throw new Error(
          typeof body.error === 'string'
            ? body.error
            : "Impossible de créer l'employé."
        );
      }

      setCreateResult(body);
      setCreateForm(defaultCreateForm);
      await fetchEmployees(true);
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : 'Création impossible.'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const closeImportDialog = () => {
    setIsImportOpen(false);
    setSelectedFile(null);
    setImportError(null);
    setImportResult(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setImportError(null);
  };

  const handleImport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      setImportError('Sélectionnez un fichier CSV ou XLSX à importer.');
      return;
    }

    try {
      setIsImporting(true);
      setImportError(null);

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/users/import', {
        method: 'POST',
        body: formData,
      });

      const payload = (await response
        .json()
        .catch(() => null)) as ImportApiPayload | null;

      if (!payload) {
        throw new Error('Réponse invalide du serveur.');
      }

      if (!response.ok) {
        if (Array.isArray(payload.errors)) {
          setImportResult({
            inserted: payload.inserted ?? 0,
            users: Array.isArray(payload.users) ? payload.users : [],
            errors: payload.errors,
          });
        }

        throw new Error(
          typeof payload.error === 'string'
            ? payload.error
            : 'Import impossible. Corrigez le fichier et réessayez.'
        );
      }

      setImportResult({
        inserted: payload.inserted ?? 0,
        users: payload.users ?? [],
        errors: payload.errors ?? [],
      });

      setSelectedFile(null);
      await fetchEmployees(true);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "L'import a échoué.");
    } finally {
      setIsImporting(false);
    }
  };

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditForm({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      managerId: '',
    });
    setEditError(null);
    setIsEditOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditOpen(false);
    setEditingEmployee(null);
    setEditForm(defaultCreateForm);
    setEditError(null);
  };

  const handleEditChange = <Key extends keyof CreateFormState>(
    key: Key,
    value: CreateFormState[Key]
  ) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingEmployee) return;

    try {
      setIsEditing(true);
      setEditError(null);

      const payload = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        role: editForm.role,
        managerId: editForm.managerId || null,
      };

      const response = await fetch(`/api/users/${editingEmployee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(body?.error ?? "Impossible de modifier l'employé");
      }

      closeEditDialog();
      await fetchEmployees(true);
    } catch (err) {
      setEditError(
        err instanceof Error ? err.message : 'Modification impossible'
      );
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/users/${deleteConfirm.id}`, {
        method: 'DELETE',
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(body?.error ?? "Impossible de supprimer l'employé");
      }

      setDeleteConfirm(null);
      await fetchEmployees(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Suppression impossible');
      setDeleteConfirm(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un employé..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-400 self-center sm:order-3" />
          ) : null}
          <button
            type="button"
            onClick={openCreateDialog}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            Ajouter un employé
          </button>
          <button
            type="button"
            onClick={openImportDialog}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 sm:w-auto"
          >
            <Upload className="w-5 h-5" />
            Importer des employés
          </button>
        </div>
      </div>

      {error ? (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Erreur</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Chargement des employés…
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-10 text-center text-slate-500">
          <p className="font-medium text-slate-700 dark:text-slate-300">
            Aucun employé ne correspond à votre recherche.
          </p>
          <p className="mt-2 text-sm">
            Ajustez le filtre ou importez une liste depuis un fichier CSV ou
            XLSX.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">
                    Employé
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">
                    Rôle
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">
                    Manager
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">
                    Date d'entrée
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">
                    Statut
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredEmployees.map((employee) => {
                  const initials = employee.name
                    .split(' ')
                    .map((part) => part[0] ?? '')
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={employee.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {initials || '??'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {employee.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {employee.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            employee.role === 'ADMIN'
                              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                              : employee.role === 'MANAGER'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {roleLabels[employee.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {employee.managerName ?? '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {dateFormatter.format(new Date(employee.createdAt))}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(employee.isActive)}`}
                        >
                          {employee.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditDialog(employee)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              window.location.href = `mailto:${employee.email}`;
                            }}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition"
                            title="Envoyer un email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(employee)}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isCreateOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Ajouter un employé
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Créez un compte individuel. Un mot de passe temporaire sera
                  généré.
                </p>
              </div>
              <button
                type="button"
                onClick={closeCreateDialog}
                className="rounded-full p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {createError ? (
              <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Création impossible</p>
                  <p className="text-sm">{createError}</p>
                </div>
              </div>
            ) : null}

            {createResult ? (
              <div className="mb-4 space-y-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                <p className="text-sm font-semibold">
                  {createResult.name} ({createResult.email}) a été créé.
                </p>
                <p className="text-xs">
                  Mot de passe temporaire:{' '}
                  <span className="rounded bg-slate-900/90 px-1.5 py-0.5 font-mono text-white dark:bg-slate-700">
                    {createResult.tempPassword}
                  </span>
                </p>
              </div>
            ) : null}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(event) =>
                    handleCreateChange('name', event.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
                  Adresse email *
                </label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(event) =>
                    handleCreateChange('email', event.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
                    Rôle *
                  </label>
                  <select
                    value={createForm.role}
                    onChange={(event) =>
                      handleCreateChange(
                        'role',
                        event.target.value as EmployeeRole
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="EMPLOYEE">Employé</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">
                    Manager (optionnel)
                  </label>
                  <select
                    value={createForm.managerId}
                    onChange={(event) =>
                      handleCreateChange('managerId', event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="">Aucun</option>
                    {managerOptions.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name}
                      </option>
                    ))}
                  </select>
                  {managerOptions.length === 0 ? (
                    <p className="mt-1 text-xs text-slate-400">
                      Aucun manager disponible pour le moment.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeCreateDialog}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                  disabled={isCreating}
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {isCreating ? 'Création…' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isImportOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Importer des employés
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Chargez un fichier CSV ou XLSX pour créer plusieurs comptes en
                  une seule fois.
                </p>
              </div>
              <button
                type="button"
                onClick={closeImportDialog}
                className="rounded-full p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleImport} className="space-y-5">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                <p className="font-medium text-slate-700 dark:text-slate-200">
                  Format attendu
                </p>
                <ul className="mt-2 space-y-1 list-disc pl-5">
                  <li>Extensions acceptées: .csv, .xlsx, .xls (max 5 Mo).</li>
                  <li>
                    Colonnes recommandées: email, prénom, nom, statut, rôle,
                    managerEmail.
                  </li>
                  <li>Les rôles valides sont ADMIN, MANAGER ou EMPLOYEE.</li>
                </ul>
                <a
                  href="/templates/employees-import-template.csv"
                  download
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-500/40 dark:text-blue-300 dark:hover:bg-blue-900/20"
                >
                  <Download className="h-4 w-4" />
                  Télécharger le modèle CSV
                </a>
              </div>

              <label className="flex flex-col gap-3 rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500 hover:border-blue-400 hover:text-blue-600 dark:border-slate-600 dark:hover:border-blue-500">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-6 w-6" />
                  <span className="text-sm font-medium">
                    {selectedFile
                      ? 'Changer de fichier'
                      : 'Déposez votre fichier ici ou cliquez pour parcourir'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedFile ? selectedFile.name : 'CSV ou XLSX'}
                  </span>
                </div>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isImporting}
                />
              </label>

              {importError ? (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Import impossible</p>
                    <p className="text-sm">{importError}</p>
                  </div>
                </div>
              ) : null}

              {importResult ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                    <p className="text-sm font-semibold">
                      {importResult.inserted} compte
                      {importResult.inserted > 1 ? 's' : ''} créé
                      {importResult.inserted > 1 ? 's' : ''}.
                    </p>
                    <p className="text-xs">
                      Conservez les mots de passe temporaires pour communiquer
                      les identifiants.
                    </p>
                  </div>

                  {importResult.users.length ? (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Comptes créés
                      </p>
                      <ul className="space-y-2 text-sm">
                        {importResult.users.map((user) => (
                          <li
                            key={user.email}
                            className="flex flex-col gap-1 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-medium text-slate-900 dark:text-white">
                                {user.name} ({user.email})
                              </span>
                              <span className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
                                {roleLabels[user.role as EmployeeRole] ??
                                  user.role}
                              </span>
                            </div>
                            <div className="text-xs">
                              Mot de passe temporaire:{' '}
                              <span className="rounded bg-slate-900/90 px-1.5 py-0.5 font-mono text-white dark:bg-slate-700">
                                {user.tempPassword}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {importResult.errors.length ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
                      <p className="text-sm font-semibold">
                        Lignes à corriger ({importResult.errors.length})
                      </p>
                      <ul className="mt-2 space-y-1 text-xs">
                        {importResult.errors.map((row, index) => (
                          <li key={`${row.line}-${row.email ?? index}`}>
                            Ligne {row.line}
                            {row.email ? ` (${row.email})` : ''}: {row.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeImportDialog}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                  disabled={isImporting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isImporting}
                >
                  {isImporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {isImporting ? 'Import en cours…' : 'Importer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Modal de modification */}
      {isEditOpen && editingEmployee ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Modifier l'employé
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Modifiez les informations de {editingEmployee.name}
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditDialog}
                className="rounded-full p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {editError ? (
              <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm">{editError}</p>
              </div>
            ) : null}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => handleEditChange('email', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Rôle
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    handleEditChange('role', e.target.value as EmployeeRole)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
                >
                  <option value="EMPLOYEE">Employé</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Manager (optionnel)
                </label>
                <select
                  value={editForm.managerId}
                  onChange={(e) =>
                    handleEditChange('managerId', e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
                >
                  <option value="">Aucun manager</option>
                  {managerOptions
                    .filter((m) => m.id !== editingEmployee.id)
                    .map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditDialog}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                  disabled={isEditing}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isEditing}
                >
                  {isEditing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Edit className="h-4 w-4" />
                  )}
                  {isEditing ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Modal de confirmation de suppression */}
      {deleteConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Supprimer l'employé
                </h2>
              </div>
            </div>

            <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
              Êtes-vous sûr de vouloir supprimer{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                {deleteConfirm.name}
              </span>
              ? Cette action est irréversible et supprimera également ses
              demandes de congés et ses soldes.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                disabled={isDeleting}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {isDeleting ? 'Suppression…' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
