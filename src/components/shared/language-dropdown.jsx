'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import GlobeIcon from '@/components/icons/globe.icon'
import Image from 'next/image'
import US_FLAG from '@/assets/us_flag.png'
import DE_FLAG from '@/assets/de_flag.png'
import clsx from 'clsx'
import { FaCheck } from 'react-icons/fa6'

export default function LanguageDropdown({ defaultValue = 'en', position = 'bottom' }) {
  const dropdownRef = useRef(null)
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLocale, setSelectedLocale] = useState(defaultValue)

  const handleToggleDropdown = () => setIsOpen(!isOpen)

  const handleSelectLocale = locale => {
    const { pathname, search, hash } = window?.location
    const newPathname = `/${locale}${pathname.replace(/^\/[a-zA-Z]{2}/, '')}${search}${hash}`
    router.push(newPathname)
    setSelectedLocale(locale)
    setIsOpen(false)
    localStorage.setItem('locale', locale)
  }

  const locales = [
    {
      title: 'English',
      locale: 'en',
      flag: US_FLAG
    },
    {
      title: 'Deutsch',
      locale: 'de',
      flag: DE_FLAG
    }
  ]

  const handleClickOutside = event => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <div ref={dropdownRef} className='relative w-fit'>
      <button className='w-[176px] h-[44px] bg-transparent  p-1 border text-black text-center rounded-[11px] focus:outline-none flex justify-around items-center'>
        <div className='flex flex-1 justify-center items-center w-full px-1'>
          <GlobeIcon className='size-6' />
        </div>
        <div
          onClick={handleToggleDropdown}
          className='bg-gray-100 cursor-pointer flex items-center border gap-2 p-[5px] rounded-md'
        >
          {locales?.map(
            locale =>
              locale.locale === selectedLocale && (
                <div key={locale.locale} className='flex items-center gap-2'>
                  <Image src={locale.flag} width={20} height={20} className='rounded-full' />
                  <p>{locale.title}</p>
                </div>
              )
          )}
          <svg
            className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </div>
      </button>

      <div
        className={clsx(
          'absolute left-0 z-10 w-full mt-2 bg-white rounded-md shadow-lg overflow-hidden transform transition-all duration-300',
          {
            'opacity-100 scale-100': isOpen,
            'opacity-0 scale-95 pointer-events-none': !isOpen,
            'top-full': position === 'bottom',
            'bottom-full': position !== 'bottom'
          }
        )}
      >
        <ul className='text-gray-800 divide-y divide-slate-300 '>
          {locales?.map(locale => (
            <li
              key={locale.locale}
              onClick={() => handleSelectLocale(locale.locale)}
              className={clsx(
                locale.locale === selectedLocale ? 'bg-slate-50' : 'bg-white',
                'px-4 py-2 flex justify-between items-center gap-2 transition-all duration-300 ease-in-out transform hover:bg-gray-100 cursor-pointer'
              )}
            >
              <div className='flex items-center gap-2'>
                <Image src={locale.flag} width={20} height={20} className='rounded-full' />
                {locale?.title}
              </div>
              {locale.locale === selectedLocale && (
                <div>
                  <FaCheck className='text-green-500' size={16} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
