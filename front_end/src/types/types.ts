export type ButtonType = {
  title: string; // Texto exibido dentro do botão
  variantButton?: "default" | "outline"; // Estilo visual do botão (default: preenchido | outline: borda)
  onClick?: () => void; // Função executada ao clicar no botão
  disabled?: boolean; // Desabilita interações com o botão
  type?: "button" | "submit" | "reset"; // Tipo HTML do botão
  className?: string; // Classes CSS adicionais para customização
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
