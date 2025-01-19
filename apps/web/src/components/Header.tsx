'use client';

import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();

  // Sembunyikan Header jika berada di /register atau /login
  if (pathname === '/auth/register' || pathname === '/auth/login') {
    return null;
  }

  return (
    <>
      <div className="navbar bg-neutral text-neutral-content">
        <div className="flex-1">
          <a className="btn btn-ghost text-2xl ml-8">Inovice</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">

            <li className='mr-16'>
              <details>
                <summary>Account</summary>
                <ul className="bg-base-100 rounded-t-none p-2 z-50 min-w-32">
                  <li>
                    <a>My Profile</a>
                  </li>
                  <li>
                    <a>Logout</a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
