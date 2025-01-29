'use client';

import { usePathname, useRouter } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter()

  if (pathname === '/auth/register' || pathname === '/auth/login') {
    return null;
  }

  const handleLogout = () => {
    localStorage.clear
    router.push('auth/login')
  }

  return (
    <>
      <div className="navbar bg-slate-500">
        <div className="flex-1">
          <a className=" text-white text-2xl ml-8">Inovice</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">

            <li className='mr-16'>
              <details>
                <summary  className='text-lg text-white'>Account</summary>
                <ul className="bg-slate-100 rounded-t-none p-2 z-50 min-w-32">
                  <li>
                    <a onClick={()=>{router.push('/account')}}>My Profile</a>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
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
