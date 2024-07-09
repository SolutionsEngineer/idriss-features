export const MainContent = () => {
  return (
    <div className="shrink-0 grow p-10">
      <div>
        <label
          htmlFor="first_name"
          className="mb-1 block text-xs text-gray-700"
        >
          Look up your wallet address
        </label>
        <input
          autoFocus
          type="text"
          id="first_name"
          className="mb-1.5 box-border block h-[38px] w-full rounded border border-[#cccccc] bg-white px-3 py-2 align-middle font-sans text-sm leading-[1.428571429] text-[#333333] outline-none"
          placeholder="hello@idriss.xyz  |  +1 650...  |  @IDriss_xyz"
        />
      </div>
    </div>
  );
};
