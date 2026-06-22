import { Component, type ReactNode } from 'react';

// Keeps a WebGL/R3F failure from ever crashing the whole page. If the 3D scene
// throws (e.g. a context-loss edge case), we quietly fall back to the static
// navy background instead of remounting/flashing the site.
type Props = { children: ReactNode };
type State = { failed: boolean };

export class SceneBoundary extends Component<Props, State> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    // eslint-disable-next-line no-console
    console.warn('[Scene] disabled after error:', err);
  }
  render() {
    if (this.state.failed) return null; // .bg-canvas already paints #0a0a1e
    return this.props.children;
  }
}
