interface TalhaoPageProps {
  params: Promise<{ fazenda: string; talhao: string }>;
}

export default async function TalhaoPage({ params }: TalhaoPageProps) {
  const { fazenda, talhao } = await params;
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-verde-mata">Talhão: {talhao}</h2>
      <p className="text-verde-eucalipto mt-1">Fazenda: {fazenda}</p>
      <p className="text-verde-eucalipto mt-2">Gerencie parcelas deste talhão</p>
    </div>
  );
}
