import { StrictMode, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import "./main.css"
import Navbar from './navbar.js'

const seasons = import.meta.glob('./seasons/*.json', {
	eager: true,
	import: 'default'
})

const root = document.getElementById('root') ?? document.createElement("div")

createRoot(root).render(
    <StrictMode>
		<BrowserRouter>
        	<Navbar />
			<Routes>
				<Route path="/" element={<Homepage />} />
			
				<Route path="/:season" element={<Season />} />

				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
    </StrictMode>
)

interface Video {
	uploader: string;
	title: string;
	url: string;
	date: Date;
}

function Season() {
	const { season } = useParams()

	const key = `./seasons/${season}.json`
	const data = seasons[key]

	if (!data) {
		return <NotFound />
	}

	let videos: Video[] = [];

	for (const player of data.players) {
		for (const video of player.videos) {
			videos.push({
				title: video.title,
				date: new Date(Date.parse(video.date)),
				url: video,
				uploader: player.name
			})
		}
	}

	const [sortColumn, setSortColumn] = useState<"uploader" | "date">("date")
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
	const [uploaderFilter, setUploaderFilter] = useState("all")

	const uploaders = [...new Set(videos.map(video => video.uploader))]

	const displayedVideos = useMemo(() => {
		return videos
			.filter(video =>
				uploaderFilter === "all" ||
				video.uploader === uploaderFilter
			)
			.sort((a, b) => {
				let comparison: number

				if (sortColumn === "uploader") {
					comparison = a.uploader.localeCompare(b.uploader)
				} else {
					comparison = a.date.getTime() - b.date.getTime()
				}

				return sortDirection === "asc"
					? comparison
					: -comparison
			})
	}, [videos, uploaderFilter, sortColumn, sortDirection])

	function sortBy(column: "uploader" | "date") {
		if (sortColumn === column) {
			setSortDirection(direction =>
				direction === "asc" ? "desc" : "asc"
			)
		} else {
			setSortColumn(column)
			setSortDirection("asc")
		}
	}

	return (
		<div className="content">
			<h1>{data.name}</h1>

			<label>
				Filter by uploader:{" "}
				<select
					value={uploaderFilter}
					onChange={e => setUploaderFilter(e.target.value)}
				>
					<option value="all">All uploaders</option>

					{uploaders.map(uploader => (
						<option key={uploader} value={uploader}>
							{uploader}
						</option>
					))}
				</select>
			</label>

			<table>
				<thead>
					<tr>
						<th>Video</th>

						<th>
							<button onClick={() => sortBy("uploader")}>
								Uploader
								{sortColumn === "uploader" &&
									(sortDirection === "asc" ? " ↑" : " ↓")}
							</button>
						</th>

						<th>
							<button onClick={() => sortBy("date")}>
								Date
								{sortColumn === "date" &&
									(sortDirection === "asc" ? " ↑" : " ↓")}
							</button>
						</th>
					</tr>
				</thead>

				<tbody>
					{displayedVideos.map(video => (
						<tr key={video.url}>
							<td>
								<a href={video.url}>{video.title}</a>
							</td>
							<td>{video.uploader}</td>
							<td>{video.date.toDateString()}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

function Homepage() {
    return (
		<div className="content">
			Homepage
		</div>
	)
}

function NotFound() {
	return (
		<div className="error">
			<h1>404 : Page not found</h1>
			<p>Go <Link to="/">Home</Link></p>
		</div>
	)
}