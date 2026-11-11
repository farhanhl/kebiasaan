import { createTheme } from "flowbite-react";

export const flowbiteCustomTheme = createTheme({
  button: {
    base: "group relative flex items-center justify-center text-center font-medium transition-all focus:outline-none focus:ring-4 rounded-full cursor-pointer disabled:cursor-not-allowed",
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
      href: "hover:border-primary/50 hover:shadow-glow cursor-pointer",
    },
  },
  modal: {
    root: {
      base: "fixed inset-0 z-50 h-dvh w-screen overflow-y-auto overflow-x-hidden",
      show: {
        on: "flex items-center justify-center p-4 bg-black/80 backdrop-blur-md min-h-dvh",
        off: "hidden",
      },
      positions: {
        "top-left": "items-start justify-start",
        "top-center": "items-start justify-center",
        "top-right": "items-start justify-end",
        "center-left": "items-center justify-start",
        "center": "items-center justify-center",
        "center-right": "items-center justify-end",
        "bottom-right": "items-end justify-end",
        "bottom-center": "items-end justify-center",
        "bottom-left": "items-end justify-start",
      },
    },
    content: {
      base: "relative w-full max-w-md my-auto flex items-center justify-center",
      inner:
        "relative flex w-full max-h-[90dvh] flex-col rounded-3xl border border-border/80 bg-bg text-fg shadow-2xl overflow-hidden",
    },
    body: {
      base: "flex-1 overflow-auto p-5 md:p-6 bg-bg text-fg",
    },
    header: {
      base: "flex items-start justify-between rounded-t-3xl border-b-0 bg-bg p-5 pb-2",
      title: "text-lg font-bold font-display text-fg",
      close: {
        base: "ms-auto inline-flex items-center rounded-full bg-transparent p-1.5 text-sm text-muted hover:bg-surface hover:text-fg cursor-pointer transition-colors",
        icon: "h-5 w-5",
      },
    },
    footer: {
      base: "flex items-center gap-2 rounded-b-3xl border-t-0 bg-bg p-5 pt-2",
    },
  },
  textInput: {
    field: {
      input: {
        base: "block w-full border rounded-2xl focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 text-fg text-base md:text-sm transition-colors",
        sizes: {
          sm: "p-2 text-base md:text-xs",
          md: "p-2.5 text-base md:text-sm",
          lg: "p-4 text-base",
        },
        colors: {
          gray: "border-border/80 bg-surface/60 text-fg placeholder:text-muted/60 focus:border-primary/60 focus:ring-primary/20 dark:border-border/80 dark:bg-surface/60 dark:text-fg dark:placeholder:text-muted/60 dark:focus:border-primary/60 dark:focus:ring-primary/20",
          info: "border-primary/80 bg-surface/60 text-fg placeholder:text-muted/60 focus:border-primary focus:ring-primary/20 dark:border-primary/80 dark:bg-surface/60 dark:text-fg dark:placeholder:text-muted/60 dark:focus:border-primary dark:focus:ring-primary/20",
          failure: "border-bad/80 bg-surface/60 text-fg placeholder:text-muted/60 focus:border-bad focus:ring-bad/20 dark:border-bad/80 dark:bg-surface/60 dark:text-fg dark:placeholder:text-muted/60 dark:focus:border-bad dark:focus:ring-bad/20",
          warning: "border-accent/80 bg-surface/60 text-fg placeholder:text-muted/60 focus:border-accent focus:ring-accent/20 dark:border-accent/80 dark:bg-surface/60 dark:text-fg dark:placeholder:text-muted/60 dark:focus:border-accent dark:focus:ring-accent/20",
          success: "border-good/80 bg-surface/60 text-fg placeholder:text-muted/60 focus:border-good focus:ring-good/20 dark:border-good/80 dark:bg-surface/60 dark:text-fg dark:placeholder:text-muted/60 dark:focus:border-good dark:focus:ring-good/20",
        },
      },
    },
  },
  textarea: {
    base: "block w-full rounded-2xl border border-border/80 bg-surface/60 p-3 text-base md:text-sm text-fg placeholder:text-muted/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors dark:border-border/80 dark:bg-surface/60 dark:text-fg dark:placeholder:text-muted/60 dark:focus:border-primary/60 dark:focus:ring-primary/20",
    colors: {
      gray: "border-border/80 bg-surface/60 text-fg focus:border-primary/60 focus:ring-primary/20 dark:border-border/80 dark:bg-surface/60 dark:text-fg dark:focus:border-primary/60 dark:focus:ring-primary/20",
      info: "border-primary/80 bg-surface/60 text-fg focus:border-primary/60 focus:ring-primary/20 dark:border-primary/80 dark:bg-surface/60 dark:text-fg dark:focus:border-primary/60 dark:focus:ring-primary/20",
      failure: "border-bad/80 bg-surface/60 text-fg focus:border-bad/60 focus:ring-bad/20 dark:border-bad/80 dark:bg-surface/60 dark:text-fg dark:focus:border-bad/60 dark:focus:ring-bad/20",
      warning: "border-accent/80 bg-surface/60 text-fg focus:border-accent/60 focus:ring-accent/20 dark:border-accent/80 dark:bg-surface/60 dark:text-fg dark:focus:border-accent/60 dark:focus:ring-accent/20",
      success: "border-good/80 bg-surface/60 text-fg focus:border-good/60 focus:ring-good/20 dark:border-good/80 dark:bg-surface/60 dark:text-fg dark:focus:border-good/60 dark:focus:ring-good/20",
    },
  },
  select: {
    field: {
      select: {
        base: "block w-full border rounded-2xl focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 text-fg text-base md:text-sm",
        sizes: {
          sm: "p-2 text-base md:text-xs",
          md: "p-2.5 text-base md:text-sm",
          lg: "p-4 text-base",
        },
        colors: {
          gray: "border-border bg-surface-raised text-fg focus:border-primary focus:ring-primary/40 dark:border-border dark:bg-surface-raised dark:text-fg",
          info: "border-primary bg-surface-raised text-fg focus:border-primary focus:ring-primary/40 dark:border-primary dark:bg-surface-raised dark:text-fg",
          failure: "border-bad bg-surface-raised text-fg focus:border-bad focus:ring-bad/40 dark:border-bad dark:bg-surface-raised dark:text-fg",
          warning: "border-accent bg-surface-raised text-fg focus:border-accent focus:ring-accent/40 dark:border-accent dark:bg-surface-raised dark:text-fg",
          success: "border-good bg-surface-raised text-fg focus:border-good focus:ring-good/40 dark:border-good dark:bg-surface-raised dark:text-fg",
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
