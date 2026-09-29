import Button from '../../components/ui/Button';
import Image from 'next/image';
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
          <h1 className="text-3xl text-creme-flor">Redefinir Senha</h1>
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
            className="w-52.75 h-12 mt-8 text-lg self-center bg-[#F17C38] hover:bg-[#F17C38]/90 text-creme-flor"
          />
        </div>
      </div>
    </div>
  );
}
