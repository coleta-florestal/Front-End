import Button from '../../components/core/Button';
import Image from 'next/image';
import logo from '../../../public/assets/apenas_circulo.png';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-creme-flor px-4 py-6 sm:py-8">
      <div className="flex h-full w-full max-w-130 flex-col gap-5 rounded-xl bg-linear-to-br from-[#245829] to-[#3D7E3F] p-6 shadow-lg lg:h-130 lg:w-130 lg:gap-6 lg:p-11">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            src={logo}
            alt="Glupta-Logo"
            className="h-20 w-20 select-none object-contain lg:h-24 lg:w-24"
            loading="eager"
          />
          <h1 className="text-2xl text-creme-flor lg:text-3xl">Redefinir Senha</h1>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-creme-flor font-semibold">Nova senha</p>
            <div className="bg-creme-flor p-2 rounded-md">
              <input
                type="password"
                placeholder="Digite sua nova senha"
                className="bg-creme-flor text-verde-mata placeholder:text-verde-mata focus:outline-none w-full"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-creme-flor font-semibold">Confirme sua senha</p>
            </div>
            <div className="bg-creme-flor p-2 rounded-md">
              <input
                type="password"
                placeholder="Digite sua senha novamente"
                className="bg-creme-flor text-verde-mata placeholder:text-verde-mata focus:outline-none w-full"
              />
            </div>
          </div>
          <Button
            label="Redefinir senha"
            className="mt-4 h-12 w-full text-lg self-center bg-[#F17C38] text-creme-flor hover:bg-[#F17C38]/90 lg:mt-8 lg:w-52.75"
          />
        </div>
      </div>
    </div>
  );
}
