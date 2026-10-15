interface FazendaPageProps {
  params: Promise<{ fazenda: string }>;
}

export default async function FazendaPage({ params }: FazendaPageProps) {
  const { fazenda } = await params;
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-verde-mata">Fazenda: {fazenda}</h2>
      <p className="text-verde-eucalipto mt-2">Gerencie talhões desta fazenda</p>
    </div>
  );
}