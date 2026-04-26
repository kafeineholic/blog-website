import MuiPagination from "@mui/material/Pagination";
import { Stack } from "@mui/material";

interface ListPaginationProps {
	count: number;
	page: number;
	onChange: (page: number) => void;
}

const ListPagination = ({ count, page, onChange }: ListPaginationProps) => {
	if (count <= 1) {
		return null;
	}

	return (
		<Stack sx={{ alignItems: "center", pt: 1 }}>
			<MuiPagination
				count={count}
				page={page}
				onChange={(_, nextPage) => onChange(nextPage)}
				color="standard"
				shape="rounded"
			/>
		</Stack>
	);
};

export default ListPagination;
