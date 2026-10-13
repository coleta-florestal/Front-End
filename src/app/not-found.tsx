'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '../components/core/Button';
import logo from '../../public/assets/logo.png';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-creme-flor px-4 py-8">
      <div className="flex w-full max-w-255 flex-col items-center justify-center gap-2 lg:w-255 lg:flex-row lg:gap-8">
        <Image src={logo} alt="Glupta-Logo" className="h-60 w-60 select-none object-contain lg:h-70 lg:w-70" draggable={false} loading="eager" />
        <div className="flex flex-col items-center justify-center gap-4 bg-creme-flor p-5 sm:p-8">
          <h1 className="text-4xl font-bold text-justify text-verde-mata lg:text-6xl">Página não encontrada.</h1>
          <p className="text-justify text-base leading-7 font-semibold text-marrom-casca lg:text-lg lg:leading-8">
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
