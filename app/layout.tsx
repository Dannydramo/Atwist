import React from "react";
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from "@/components/ui/toaster";
export const metadata = {
	title: "Atwist",
	description: "Connecting clients to potential artisans",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<>
					<Toaster />
					{children}
				</>
			</body>
		</html>
	);
}
