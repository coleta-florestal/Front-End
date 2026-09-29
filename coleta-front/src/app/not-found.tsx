'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '../components/ui/Button';
import logo from '../../public/assets/logo.png';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-creme-flor">
      <div className="flex items-center justify-center gap-8 w-252">
        <Image src={logo} alt="Glupta-Logo" className="h-70 w-70 object-contain" loading="eager" />
        <div className="flex flex-col items-center justify-center gap-4 bg-creme-flor p-8">
          <h1 className="text-6xl font-bold text-verde-mata">Página não encontrada</h1>
          <p className="text-lg leading-8 font-semibold text-marrom-casca text-justify">
            A página que você está procurando não existe. Verifique se o endereço está correto ou
            volte para a página inicial.
          </p>
          <Button
            label="Voltar"
            onClick={() => router.back()}
            className="bg-[#F17C38] text-creme-flor  hover:bg-[#F17C38]/90 w-full"
          />
        </div>
      </div>
    </div>
  );
}
