(function initIcons() {
  const Icon = ({ d, size = 15, ...props }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {d}
    </svg>
  );

  const EditIcon = () => (
    <Icon
      d={
        <>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </>
      }
    />
  );

  const TrashIcon = () => (
    <Icon
      d={
        <>
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </>
      }
    />
  );

  const CheckIcon = () => <Icon d={<polyline points="20 6 9 17 4 12" />} />;

  const PlusIcon = () => (
    <Icon
      d={
        <>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </>
      }
    />
  );

  const SaveIcon = () => (
    <Icon
      d={
        <>
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </>
      }
    />
  );

  const LayersIcon = () => (
    <Icon
      d={
        <>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </>
      }
    />
  );

  const FolderIcon = () => (
    <Icon
      d={
        <>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </>
      }
    />
  );

  const CloseIcon = () => (
    <Icon
      d={
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      }
    />
  );

  window.WheelRandomizer = window.WheelRandomizer || {};
  window.WheelRandomizer.icons = {
    EditIcon,
    TrashIcon,
    CheckIcon,
    PlusIcon,
    SaveIcon,
    LayersIcon,
    FolderIcon,
    CloseIcon,
  };
})();
