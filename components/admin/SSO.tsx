
import React from 'react';
// FIX: Changed import to be relative
import { ArrowUpOnSquareIcon } from '../Icons';

const SSO: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Single Sign-On (SSO)</h1>
      <p className="text-pm-text-secondary mb-6">Configure SSO to allow your team to sign in with your identity provider.</p>

      <div className="bg-pm-dark-secondary rounded-lg border border-pm-border max-w-2xl">
        <div className="p-6">
          <h2 className="font-semibold mb-4">SAML Configuration</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="idp-metadata" className="block text-sm font-medium text-pm-text-secondary mb-1">Identity Provider Metadata</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-pm-border border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <ArrowUpOnSquareIcon className="mx-auto h-12 w-12 text-pm-text-secondary" />
                  <div className="flex text-sm text-pm-text-secondary">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-pm-dark rounded-md font-medium text-pm-blue hover:text-pm-blue/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-pm-dark focus-within:ring-pm-blue">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop your metadata XML</p>
                  </div>
                  <p className="text-xs text-pm-text-secondary">.XML up to 1MB</p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="sso-client-id" className="block text-sm font-medium text-pm-text-secondary mb-1">Client ID</label>
              {/* TODO: Add SSO credentials to secret manager and reference via process.env.SSO_OIDC_CLIENT_ID. */}
              <input
                type="text"
                id="sso-client-id"
                placeholder="REPLACE_WITH_CLIENT_ID"
                className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pm-blue"
              />
            </div>

            <div>
              <label htmlFor="sso-client-secret" className="block text-sm font-medium text-pm-text-secondary mb-1">Client Secret</label>
               {/* TODO: Add SSO credentials to secret manager and reference via process.env.SSO_OIDC_CLIENT_SECRET. */}
              <input
                type="password"
                id="sso-client-secret"
                placeholder="••••••••••••••••••••••"
                className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pm-blue"
              />
            </div>

             <div className="pt-2 flex justify-end">
                <button
                    type="submit"
                    className="bg-pm-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-pm-blue/90 transition-colors"
                >
                    Save Configuration
                </button>
             </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SSO;
