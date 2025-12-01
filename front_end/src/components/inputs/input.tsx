/**
 * Componente de Input reutilizável e padronizado.
 *
 * @component
 * @description
 * Input padrão para todo o projeto com estilo centralizado.
 * Suporta todos os atributos nativos do HTML <input>.
 *
 * @example
 * ```tsx
 * <Input
 *   type="email"
 *   placeholder="Digite seu e-mail"
 *   onChange={(e) => setValue(e.target.value)}
 * />
 * ```
 */
const Input = ({
  className, // Classes CSS adicionais para customização
  ...props // Todos os demais atributos nativos do input (type, placeholder, onChange, etc.)
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props} // Espalha todas as props nativas do input
      className={`w-[350px] rounded-md bg-white px-2 py-[11px] text-xs text-[#32343E] placeholder-[#32343E] transition-colors outline-none focus:border-2 focus:border-[#C92A0E] ${className || ""}`}
      // Classes aplicadas:
      // - h-[34px]: altura fixa
      // - w-[350px]: largura padrão
      // - rounded-md: bordas arredondadas
      // - bg-white: fundo branco
      // - px-2 py-[11px]: espaçamento interno
      // - text-xs text-[#32343E]: tamanho e cor do texto
      // - outline-none: remove outline padrão do browser
      // - placeholder-[#32343E]: cor do placeholder
      // - transition-colors: transição suave de cores
      // - focus:border-*: borda vermelha ao focar
      // - className: classes personalizadas do componente pai
    />
  );
};

export default Input;
