import Button from '../../components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../public/assets/apenas_circulo.png';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-creme-flor">
      <div className="flex flex-col bg-linear-to-br from-[#245829] to-[#3D7E3F] p-11 gap-6 rounded-xl shadow-lg w-130 h-130">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            src={logo}
            alt="Glupta-Logo"
            className="h-24 w-24 object-contain"
            loading="eager"
          />
          <h1 className="text-3xl text-creme-flor">Criar acesso</h1>
        </div>
        <form autoComplete="off" className="w-full flex flex-col gap-4">
          <div className="w-full flex gap-4">
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
          <div className="w-full flex gap-4">
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
        <div className="flex flex-col gap-4 mt-2">
          <Button
            label="Entrar"
            className="w-36.25 h-12 text-lg self-center bg-[#F17C38] hover:bg-[#F17C38]/90 text-creme-flor"
          />
          <p className="text-creme-flor text-lg text-center">
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
