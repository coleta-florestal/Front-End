'use client';

import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import Button from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { ProfileFormErrors, ProfileFormValues, UserProfile } from '@/types/profile';

interface ProfileFormCardProps {
  initialProfile: UserProfile;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOCK_STORAGE_KEY = 'glupta_mock_profile';

function formatPhoneMask(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, '').slice(0, 11);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

function getInitialsFromName(name: string, fallback: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function validateProfileForm(values: ProfileFormValues): ProfileFormErrors {
  const errors: ProfileFormErrors = {};
  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim();
  const trimmedOrg = values.organization.trim();
  const phoneDigits = values.phone.replace(/\D/g, '');

  if (!trimmedName) errors.name = 'O nome é obrigatório.';
  else if (trimmedName.length < 3) errors.name = 'O nome deve ter pelo menos 3 caracteres.';

  if (!trimmedEmail) errors.email = 'O email é obrigatório.';
  else if (!EMAIL_REGEX.test(trimmedEmail)) errors.email = 'Informe um endereço de email válido.';

  if (!trimmedOrg) errors.organization = 'A organização é obrigatória.';
  else if (trimmedOrg.length < 2)
    errors.organization = 'A organização deve ter pelo menos 2 caracteres.';

  if (!phoneDigits) errors.phone = 'O telefone é obrigatório.';
  else if (phoneDigits.length < 10 || phoneDigits.length > 11)
    errors.phone = 'Informe um telefone válido com DDD.';

  return errors;
}

export default function ProfileFormCard({ initialProfile }: ProfileFormCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  const [values, setValues] = useState<ProfileFormValues>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(MOCK_STORAGE_KEY);
      if (savedData) {
        try {
          return JSON.parse(savedData) as ProfileFormValues;
        } catch (error) {
          console.error('Erro ao ler mock do perfil:', error);
        }
      }
    }
    return {
      name: initialProfile.name,
      email: initialProfile.email,
      organization: initialProfile.organization,
      phone: initialProfile.phone,
    };
  });

  const [profileHeader, setProfileHeader] = useState(() => {
    let name = initialProfile.displayName;
    let initials = initialProfile.initials;

    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(MOCK_STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData) as ProfileFormValues;
          if (parsed.name) {
            name = parsed.name.trim();
            initials = getInitialsFromName(name, initialProfile.initials);
          }
        } catch (error) {
          console.error('Erro ao ler cabeçalho do mock:', error);
        }
      }
    }

    return {
      displayName: name,
      roleTitle: initialProfile.roleTitle,
      initials,
    };
  });

  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Solução para o ESLint e Hidratação:
  // Usa setTimeout para tirar o setState do fluxo síncrono do useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleFieldChange = (
    field: keyof ProfileFormValues,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setSuccessMessage(null);
    const rawValue = event.target.value;
    const formattedValue = field === 'phone' ? formatPhoneMask(rawValue) : rawValue;

    setValues((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage(null);

    const validationErrors = validateProfileForm(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});

    setTimeout(() => {
      const newName = values.name.trim();
      const newInitials = getInitialsFromName(newName, profileHeader.initials);

      setProfileHeader((prev) => ({
        ...prev,
        initials: newInitials,
        displayName: newName,
      }));

      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(values));
      window.dispatchEvent(new Event('profile-updated'));

      setIsSaving(false);
      setSuccessMessage('Alterações salvas com sucesso.');
    }, 600);
  };

  const displayHeader = isMounted
    ? profileHeader
    : {
        initials: initialProfile.initials,
        displayName: initialProfile.displayName,
        roleTitle: initialProfile.roleTitle,
      };

  const displayValues = isMounted
    ? values
    : {
        name: initialProfile.name,
        email: initialProfile.email,
        organization: initialProfile.organization,
        phone: initialProfile.phone,
      };

  return (
    <article className="mx-auto w-full max-w-3xl rounded-2xl border border-[#DFDBD0] bg-[#FAF8F3] p-6 shadow-sm sm:p-10">
      <header className="flex items-center gap-4">
        <div
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E4EDE2] font-serif text-lg font-bold text-[#2C5F2D]"
        >
          {displayHeader.initials}
        </div>

        <div className="flex flex-col">
          <h2 className="font-serif text-xl font-bold text-[#2C5F2D]">
            {displayHeader.displayName}
          </h2>
          <p className="mt-0.5 text-xs text-[#6E776B]">{displayHeader.roleTitle}</p>
        </div>
      </header>

      <div className="my-6 h-px w-48 bg-[#E8E4DA]" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            id="profile-name"
            label="Nome"
            value={displayValues.name}
            placeholder="Digite seu nome completo"
            error={errors.name}
            disabled={isSaving}
            maxLength={100}
            onChange={(e) => handleFieldChange('name', e)}
          />

          <Input
            id="profile-email"
            label="Email"
            type="email"
            value={displayValues.email}
            placeholder="seu.email@dominio.com.br"
            error={errors.email}
            disabled={isSaving}
            maxLength={120}
            onChange={(e) => handleFieldChange('email', e)}
          />

          <Input
            id="profile-organization"
            label="Organização"
            value={displayValues.organization}
            placeholder="Nome da organização"
            error={errors.organization}
            disabled={isSaving}
            maxLength={80}
            onChange={(e) => handleFieldChange('organization', e)}
          />

          <Input
            id="profile-phone"
            label="Telefone"
            type="tel"
            value={displayValues.phone}
            placeholder="(00) 00000-0000"
            error={errors.phone}
            disabled={isSaving}
            maxLength={15}
            onChange={(e) => handleFieldChange('phone', e)}
          />
        </div>

        {successMessage && (
          <p
            role="status"
            className="w-fit rounded-lg border border-[#B8D8BE] bg-[#E4F0E6] px-3.5 py-2 text-xs font-semibold text-[#2C5F2D]"
          >
            {successMessage}
          </p>
        )}

        <div>
          <Button
            type="submit"
            label={isSaving ? 'Salvando...' : 'Salvar alterações'}
            disabled={isSaving}
            className="rounded-xl bg-[#2C5F2D] px-6 py-3 text-sm font-bold text-[#FAF8F3] shadow-none transition-colors hover:bg-[#234B24]"
          />
        </div>
      </form>
    </article>
  );
}
