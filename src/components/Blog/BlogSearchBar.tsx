"use client";

import { ChangeEvent } from "react";
import { InputBase, Paper, useTheme } from "@mui/material";
import { IconSearch } from "@tabler/icons-react";

interface BlogSearchBarProps {
	onSearch: (value: string) => void;
}

const BlogSearchBar = ({ onSearch }: BlogSearchBarProps) => {
	const theme = useTheme();
	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		onSearch(event.target.value);
	};

	return (
		<Paper
			elevation={0}
			sx={{
				width: { xs: "100%", sm: 320 },
				borderRadius: "999px",
				border: "2px solid",
				borderColor: theme.colors.ink950,
				px: 2,
				py: 0.75,
				display: "flex",
				alignItems: "center",
				gap: 1,
				bgcolor: theme.colors.snow50,
			}}
		>
			<IconSearch size={18} color={theme.colors.ink950} />
			<InputBase
				fullWidth
				placeholder="Search blog"
				onChange={onChange}
				inputProps={{ "aria-label": "Search blog" }}
			/>
		</Paper>
	);
};

export default BlogSearchBar;
