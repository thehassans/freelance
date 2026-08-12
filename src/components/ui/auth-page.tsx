'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './button';

import {
	AppleIcon,
	AtSignIcon,
	ChevronLeftIcon,
	GithubIcon,
	Grid2x2PlusIcon,
} from 'lucide-react';
import { Input } from './input';
import { cn } from '../../lib/utils';

export function AuthPage({ onSubmit, error }: { onSubmit: (email: string, pass: string) => void, error?: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

	return (
		<main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2 bg-white">
			<div className="bg-[#e6f4f1] relative hidden h-full flex-col border-r border-slate-200 p-10 lg:flex">
				<div className="from-white/50 absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
				<div className="z-10 flex items-center gap-2">
					<img src="/freelancerkitlogo.png" alt="Freelancer Kit Logo" className="h-24 object-contain" />
				</div>
				<div className="z-10 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-xl text-slate-800 font-medium">
							&ldquo;This Platform has helped me to save time and serve my
							clients faster than ever before.&rdquo;
						</p>
						<footer className="font-mono text-sm font-bold text-slate-600">
							~ FK Admin
						</footer>
					</blockquote>
				</div>
				<div className="absolute inset-0">
					<FloatingPaths position={1} />
					<FloatingPaths position={-1} />
				</div>
			</div>
			<div className="relative flex min-h-screen flex-col justify-center p-4 bg-white">
				<div
					aria-hidden
					className="absolute inset-0 isolate contain-strict -z-10 opacity-60"
				>
					<div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full" />
					<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 [translate:5%_-50%] rounded-full" />
					<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full" />
				</div>
				<Button variant="ghost" className="absolute top-7 left-5 text-gray-800 hover:bg-slate-100" asChild>
					<a href="/">
						<ChevronLeftIcon className='size-4 me-2' />
						Home
					</a>
				</Button>
				<div className="mx-auto space-y-4 sm:w-[400px]">
					<div className="flex items-center gap-2 lg:hidden">
						<img src="/freelancerkitlogo.png" alt="Freelancer Kit Logo" className="h-24 object-contain" />
					</div>
					<div className="flex flex-col space-y-1">
						<h1 className="font-heading text-2xl font-bold tracking-wide text-gray-900">
							Admin Login
						</h1>
						<p className="text-slate-500 text-base">
							Sign in with your admin credentials
						</p>
					</div>

					<form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(email, password); }}>
						<div className="space-y-2">
							<p className="text-slate-500 text-start text-xs font-medium">
								Email address
							</p>
							<div className="relative h-max">
								<Input
									placeholder="admin@example.com"
									className="peer ps-9 bg-white text-slate-900 border-slate-300 focus:border-[#1b998b]"
									type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
								/>
								<div className="text-slate-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
									<AtSignIcon className="size-4" aria-hidden="true" />
								</div>
							</div>
						</div>
            
            <div className="space-y-2">
							<p className="text-slate-500 text-start text-xs font-medium">
								Password / PIN
							</p>
							<div className="relative h-max">
								<Input
									placeholder="••••"
									className="bg-white text-slate-900 border-slate-300 focus:border-[#1b998b]"
									type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
								/>
							</div>
						</div>

            {error && (
              <p className="text-[#F87171] text-sm animate-pulse">Incorrect credentials</p>
            )}

						<Button type="submit" className="w-full bg-[#1b998b] hover:bg-[#147a6e] text-white">
							<span>Sign In</span>
						</Button>
					</form>
				</div>
			</div>
		</main>
	);
}

function FloatingPaths({ position }: { position: number }) {
	const paths = Array.from({ length: 36 }, (_, i) => ({
		id: i,
		d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
			380 - i * 5 * position
		} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
			152 - i * 5 * position
		} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
			684 - i * 5 * position
		} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
		color: `rgba(27,153,139,${0.1 + i * 0.03})`,
		width: 0.5 + i * 0.03,
	}));

	return (
		<div className="pointer-events-none absolute inset-0 overflow-hidden">
			<svg
				className="h-full w-full text-[#1b998b]"
				viewBox="0 0 696 316"
				fill="none"
			>
				<title>Background Paths</title>
				{paths.map((path) => (
					<motion.path
						key={path.id}
						d={path.d}
						stroke="currentColor"
						strokeWidth={path.width}
						strokeOpacity={0.05 + path.id * 0.015}
						initial={{ pathLength: 0.3, opacity: 0.6 }}
						animate={{
							pathLength: 1,
							opacity: [0.3, 0.6, 0.3],
							pathOffset: [0, 1, 0],
						}}
						transition={{
							duration: 20 + Math.random() * 10,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'linear',
						}}
					/>
				))}
			</svg>
		</div>
	);
}