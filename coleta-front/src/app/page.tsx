import Button from '../components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/assets/apenas_circulo.png';

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
          <h1 className="text-3xl text-creme-flor">Entrar no Glupta</h1>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-creme-flor font-semibold">Email ou usuário</p>
            <div className="bg-creme-flor p-2 rounded-md">
              <input
                type="text"
                placeholder="Digite seu email ou usuário"
                className="bg-creme-flor text-verde-mata placeholder:text-verde-mata focus:outline-none w-full"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-creme-flor font-semibold">Senha</p>
              <Link href="/recuperar-acesso" className="text-creme-flor/70 text-sm hover:underline">
                Esqueceu sua senha?
              </Link>
            </div>
            <div className="bg-creme-flor p-2 rounded-md">
              <input
                type="password"
                placeholder="Digite sua senha"
                className="bg-creme-flor text-verde-mata placeholder:text-verde-mata focus:outline-none w-full"
              />
            </div>
          </div>
          <Button
            label="Entrar"
            className="w-36.25 h-12 text-lg self-center bg-[#F17C38] hover:bg-[#F17C38]/90 text-creme-flor"
          />
        </div>
        <p className="text-creme-flor text-lg text-center">
          Não possui uma conta?{' '}
          <Link href="/cadastro" className="text-coral-flor font-semibold hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
