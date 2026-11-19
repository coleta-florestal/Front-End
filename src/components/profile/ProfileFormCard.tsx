'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { updateMyProfile } from '@/app/api/api';
import Button from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { setAuthCookies } from '@/lib/auth';
import { getInitialsFromName } from '@/lib/profile';
import { ProfileFormErrors, ProfileFormValues, UserProfile } from '@/types/profile';

interface ProfileFormCardProps {
  initialProfile: UserProfile;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateProfileForm(values: ProfileFormValues): ProfileFormErrors {
  const errors: ProfileFormErrors = {};
  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim();

  if (!trimmedName) errors.name = 'O nome é obrigatório.';
  else if (trimmedName.length < 3) errors.name = 'O nome deve ter pelo menos 3 caracteres.';

  if (!trimmedEmail) errors.email = 'O email é obrigatório.';
  else if (!EMAIL_REGEX.test(trimmedEmail)) errors.email = 'Informe um endereço de email válido.';

  return errors;
}

export default function ProfileFormCard({ initialProfile }: ProfileFormCardProps) {
  const [values, setValues] = useState<ProfileFormValues>({
    name: initialProfile.name,
    email: initialProfile.email,
  });
  // O cabeçalho só muda depois de salvar, não a cada tecla digitada no campo de nome.
  const [savedName, setSavedName] = useState(initialProfile.name);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFieldChange = (
    field: keyof ProfileFormValues,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setSuccessMessage(null);
    const rawValue = event.target.value;

    setValues((prev) => ({
      ...prev,
      [field]: rawValue,
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage(null);
    setSubmitError(null);

    const validationErrors = validateProfileForm(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});

    const payload = { name: values.name.trim(), email: values.email.trim() };

    try {
      setAuthCookies(await updateMyProfile(payload));
      setSavedName(payload.name);
      window.dispatchEvent(new Event('profile-updated'));
      setSuccessMessage('Alterações salvas com sucesso.');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Não foi possível salvar as alterações');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className="mx-auto w-full max-w-3xl rounded-2xl border border-[#DFDBD0] bg-[#FAF8F3] p-6 shadow-sm sm:p-10">
      <header className="flex items-center gap-4">
        <div
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E4EDE2] font-serif text-lg font-bold text-verde-mata"
        >
          {getInitialsFromName(savedName, initialProfile.initials)}
        </div>

        <h2 className="font-serif text-xl font-bold text-verde-mata">{savedName}</h2>
      </header>

      <div className="my-6 h-px w-48 bg-[#E8E4DA]" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            id="profile-name"
            label="Nome"
            value={values.name}
            placeholder="Digite seu nome completo"
            error={errors.name}
            disabled={isSaving}
            maxLength={50}
            onChange={(e) => handleFieldChange('name', e)}
          />

          <Input
            id="profile-email"
            label="Email"
            type="email"
            value={values.email}
            placeholder="seu.email@dominio.com.br"
            error={errors.email}
            disabled={isSaving}
            maxLength={120}
            onChange={(e) => handleFieldChange('email', e)}
          />
        </div>

        {successMessage && (
          <p
            role="status"
            className="w-fit rounded-lg border border-[#B8D8BE] bg-[#E4F0E6] px-3.5 py-2 text-xs font-semibold text-verde-mata"
          >
            {successMessage}
          </p>
        )}

        {submitError && (
          <p
            role="alert"
            className="w-fit rounded-lg border border-[#E5B8AD] bg-[#FDECE9] px-3.5 py-2 text-xs font-semibold text-[#B8543E]"
          >
            {submitError}
          </p>
        )}

        <div>
          <Button
            type="submit"
            label={isSaving ? 'Salvando...' : 'Salvar alterações'}
            disabled={isSaving}
            className="rounded-xl bg-verde-mata px-6 py-3 text-sm font-bold text-[#FAF8F3] shadow-none transition-colors hover:bg-[#234B24]"
          />
        </div>
      </form>
    </article>
  );
}
