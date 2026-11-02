import { createTheme } from "flowbite-react";

export const flowbiteCustomTheme = createTheme({
  button: {
    base: "group relative flex items-center justify-center text-center font-medium transition-all focus:outline-none focus:ring-4 rounded-full",
    pill: "rounded-full",
    color: {
      default:
        "bg-primary text-on-primary hover:bg-primary-hover focus:ring-primary/30",
      blue: "bg-primary text-on-primary hover:bg-primary-hover focus:ring-primary/30",
      cyan: "bg-primary text-on-primary hover:bg-primary-hover focus:ring-primary/30",
      gray: "border border-border bg-surface text-fg hover:bg-surface-raised focus:ring-border/40",
      dark: "border border-border bg-surface-raised text-fg hover:bg-surface focus:ring-border/40",
      light: "border border-border bg-surface text-fg hover:bg-surface-raised focus:ring-border/40",
      green: "bg-good text-on-primary hover:opacity-90 focus:ring-good/30",
      red: "bg-bad text-on-primary hover:opacity-90 focus:ring-bad/30",
      failure: "bg-bad text-on-primary hover:opacity-90 focus:ring-bad/30",
      success: "bg-good text-on-primary hover:opacity-90 focus:ring-good/30",
      warning: "bg-accent text-on-primary hover:opacity-90 focus:ring-accent/30",
      alternative:
        "border border-border bg-transparent text-fg hover:bg-surface-raised focus:ring-border/30",
    },
  },
  card: {
    root: {
      base: "flex rounded-3xl border border-border bg-surface shadow-soft transition-all",
      children: "flex h-full flex-col justify-center gap-4 p-5 md:p-6",
      horizontal: {
        off: "flex-col",
        on: "flex-col md:max-w-xl md:flex-row",
      },
      href: "hover:border-primary/50 hover:shadow-glow",
    },
  },
  modal: {
    root: {
      base: "fixed inset-x-0 top-0 z-50 h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
      show: {
        on: "flex bg-black/75 backdrop-blur-sm",
        off: "hidden",
      },
    },
    content: {
      base: "relative h-full w-full p-4 md:h-auto",
      inner:
        "relative flex max-h-[90dvh] flex-col rounded-3xl border border-border bg-surface text-fg shadow-soft",
    },
    body: {
      base: "flex-1 overflow-auto p-5 md:p-6 text-fg",
    },
    header: {
      base: "flex items-start justify-between rounded-t-3xl border-b border-border p-5",
      title: "text-xl font-bold font-display text-fg",
      close: {
        base: "ms-auto inline-flex items-center rounded-full bg-transparent p-1.5 text-sm text-muted hover:bg-surface-raised hover:text-fg",
        icon: "h-5 w-5",
      },
    },
    footer: {
      base: "flex items-center gap-2 rounded-b-3xl border-t border-border p-5",
    },
  },
  textInput: {
    field: {
      input: {
        base: "block w-full border rounded-2xl focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 text-fg text-sm",
        colors: {
          gray: "border-border bg-surface-raised text-fg placeholder:text-muted focus:border-primary focus:ring-primary/40",
          info: "border-primary bg-surface-raised text-fg placeholder:text-muted focus:border-primary focus:ring-primary/40",
          failure: "border-bad bg-surface-raised text-fg placeholder:text-muted focus:border-bad focus:ring-bad/40",
          warning: "border-accent bg-surface-raised text-fg placeholder:text-muted focus:border-accent focus:ring-accent/40",
          success: "border-good bg-surface-raised text-fg placeholder:text-muted focus:border-good focus:ring-good/40",
        },
      },
    },
  },
  textarea: {
    base: "block w-full rounded-2xl border border-border bg-surface-raised p-3 text-sm text-fg placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/40 focus:outline-none",
    colors: {
      gray: "border-border bg-surface-raised text-fg focus:border-primary focus:ring-primary/40",
      info: "border-primary bg-surface-raised text-fg focus:border-primary focus:ring-primary/40",
      failure: "border-bad bg-surface-raised text-fg focus:border-bad focus:ring-bad/40",
      warning: "border-accent bg-surface-raised text-fg focus:border-accent focus:ring-accent/40",
      success: "border-good bg-surface-raised text-fg focus:border-good focus:ring-good/40",
    },
  },
  select: {
    field: {
      select: {
        base: "block w-full border rounded-2xl focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 text-fg text-sm",
        colors: {
          gray: "border-border bg-surface-raised text-fg focus:border-primary focus:ring-primary/40",
          info: "border-primary bg-surface-raised text-fg focus:border-primary focus:ring-primary/40",
          failure: "border-bad bg-surface-raised text-fg focus:border-bad focus:ring-bad/40",
          warning: "border-accent bg-surface-raised text-fg focus:border-accent focus:ring-accent/40",
          success: "border-good bg-surface-raised text-fg focus:border-good focus:ring-good/40",
        },
      },
    },
  },
  badge: {
    root: {
      base: "flex h-fit items-center gap-1 font-semibold rounded-full px-3 py-1 text-xs",
      color: {
        info: "bg-primary/20 text-primary border border-primary/30",
        gray: "bg-surface-raised text-muted border border-border",
        failure: "bg-bad/20 text-bad border border-bad/30",
        success: "bg-good/20 text-good border border-good/30",
        warning: "bg-accent/20 text-accent border border-accent/30",
        indigo: "bg-primary/20 text-primary border border-primary/30",
        purple: "bg-secondary/20 text-secondary border border-secondary/30",
        pink: "bg-secondary/20 text-secondary border border-secondary/30",
        blue: "bg-primary/20 text-primary border border-primary/30",
        cyan: "bg-primary/20 text-primary border border-primary/30",
        dark: "bg-surface-raised text-fg border border-border",
        light: "bg-surface-raised text-fg border border-border",
        green: "bg-good/20 text-good border border-good/30",
        lime: "bg-good/20 text-good border border-good/30",
        red: "bg-bad/20 text-bad border border-bad/30",
        teal: "bg-good/20 text-good border border-good/30",
        yellow: "bg-accent/20 text-accent border border-accent/30",
      },
    },
  },
  progress: {
    base: "w-full overflow-hidden rounded-full bg-surface-raised h-3",
    bar: "rounded-full text-center font-medium leading-none text-on-primary transition-all duration-300",
    color: {
      dark: "bg-primary",
      default: "bg-primary",
      blue: "bg-primary",
      cyan: "bg-primary",
      gray: "bg-muted",
      green: "bg-good",
      indigo: "bg-primary",
      lime: "bg-good",
      purple: "bg-secondary",
      red: "bg-bad",
      teal: "bg-good",
      yellow: "bg-accent",
    },
  },
  spinner: {
    color: {
      failure: "fill-bad text-surface-raised",
      gray: "fill-muted text-surface-raised",
      info: "fill-primary text-surface-raised",
      pink: "fill-secondary text-surface-raised",
      purple: "fill-secondary text-surface-raised",
      success: "fill-good text-surface-raised",
      warning: "fill-accent text-surface-raised",
    },
  },
});

export const theme = flowbiteCustomTheme;
