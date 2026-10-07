import Button from '../../components/core/Button';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../public/assets/apenas_circulo.png';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-creme-flor px-4 py-6 sm:py-8">
      <div className="flex h-auto w-full max-w-130 flex-col gap-5 rounded-xl bg-linear-to-br from-[#245829] to-[#3D7E3F] p-6 shadow-lg lg:h-130 lg:w-130 lg:gap-6 lg:p-11">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            src={logo}
            alt="Glupta-Logo"
            className="h-20 w-20 select-none object-contain lg:h-24 lg:w-24"
            loading="eager"
          />
          <h1 className="text-2xl text-creme-flor lg:text-3xl">Criar acesso</h1>
        </div>
        <form autoComplete="off" className="w-full flex flex-col gap-4">
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="flex flex-col gap-2 w-full">
              <p className="text-creme-flor font-semibold">Nome completo</p>
              <div className="bg-creme-flor p-2 rounded-md">
                <input
                  type="text"
                  placeholder="Amanda Rocha"
                  className="bg-creme-flor text-verde-mata placeholder:text-verde-mata focus:outline-none w-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between">
                <p className="text-creme-flor font-semibold">Email</p>
              </div>
              <div className="bg-creme-flor p-2 rounded-md">
                <input
                  type="text"
                  placeholder="amanda@glupta.com.br"
                  className="bg-creme-flor text-verde-mata placeholder:text-verde-mata focus:outline-none w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="flex flex-col gap-2 w-full">
              <p className="text-creme-flor font-semibold">Senha</p>
              <div className="bg-creme-flor p-2 rounded-md">
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Digite sua senha"
                  className="bg-creme-flor text-verde-mata placeholder:text-verde-mata focus:outline-none w-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between">
                <p className="text-creme-flor font-semibold">Confirmar Senha</p>
              </div>
              <div className="bg-creme-flor p-2 rounded-md">
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirme sua senha"
                  className="bg-creme-flor text-verde-mata placeholder:text-verde-mata focus:outline-none w-full"
                />
              </div>
            </div>
          </div>
        </form>
        <div className="mt-2 flex flex-col gap-4">
          <Button
            label="Enviar solicitação"
            className="h-12 w-full text-lg self-center bg-[#F17C38] text-creme-flor hover:bg-[#F17C38]/90 lg:w-51.25"
          />
          <p className="text-center text-base text-creme-flor sm:text-lg">
            Voltar ao{' '}
            <Link href="/" className="text-coral-flor font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
