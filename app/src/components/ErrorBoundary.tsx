import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<object>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<object>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App caught error:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Oups...</h1>
            <p className="text-gray-600 mb-6">Une erreur est survenue. Recharge la page ou réessaie plus tard.</p>
            <div className="space-x-3">
              <Button onClick={this.reset} className="bg-red-600 hover:bg-red-700">Recharger</Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
