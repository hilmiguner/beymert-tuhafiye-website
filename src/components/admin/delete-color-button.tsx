"use client";

export function DeleteColorButton({ name, disabled }: { name: string; disabled: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      onClick={(event) => {
        if (!window.confirm(`"${name}" rengini kalıcı olarak silmek istiyor musunuz?`)) {
          event.preventDefault();
        }
      }}
      className="min-h-10 rounded-control border border-red-200 bg-red-50 px-3 text-xs font-extrabold text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Sil
    </button>
  );
}
