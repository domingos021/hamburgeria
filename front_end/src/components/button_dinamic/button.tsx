import type { ButtonType } from "../../types/types";

/**
 * Componente de botão reutilizável com suporte a múltiplas variantes e estados.
 *
 * @component
 * @example
 * ```tsx
 * <Button
 *   title="Clique aqui"
 *   variantButton="default"
 *   onClick={() => console.log('Clicado')}
 * />
 * ```
 */
const Button = ({
  title,
  variantButton = "default",
  onClick,
  disabled = false,
  type = "button",
  className = "",
  ...props
}: ButtonType) => {
  /**
   * Retorna as classes CSS do botão baseado na variante e estado.
   *
   * @returns {string} String com todas as classes Tailwind CSS aplicáveis
   */
  const buttonVariant = () => {
    // Classes base compartilhadas por todas as variantes
    const baseClasses =
      "mt-0 w-full cursor-pointer rounded-md border-2 py-2 text-sm font-bold transition-colors";

    // Estado desabilitado tem prioridade sobre as variantes
    if (disabled) {
      return `${baseClasses} border-gray-300 bg-gray-300 text-gray-500 cursor-not-allowed`;
    }

    // Variante padrão: fundo vermelho com texto branco
    if (variantButton === "default") {
      return `${baseClasses} border-[#C92A0E] bg-[#C92A0E] text-white hover:bg-[#A52309]`;
    }

    // Variante outline: borda vermelha com fundo branco
    if (variantButton === "outline") {
      return `${baseClasses} border-[#C92A0E] bg-white text-[#C92A0E] hover:bg-[#C92A0E] hover:text-white`;
    }

    // Fallback: retorna variante default caso nenhuma condição seja atendida
    return `${baseClasses} border-[#C92A0E] bg-[#C92A0E] text-white`;
  };

  return (
    <button
      {...props} // Espalha todas as props nativas do button (onMouseEnter, aria-label, etc.)
      type={type} // Define o tipo do botão (button, submit ou reset)
      className={`${buttonVariant()} ${className}`} // Aplica classes da variante + classes personalizadas
      onClick={onClick} // Handler para evento de clique
      disabled={disabled} // Controla o estado desabilitado do botão
    >
      {title} {/* Texto exibido no botão */}
    </button>
  );
};

export default Button;
