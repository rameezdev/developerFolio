import React, {useState, useEffect, useContext, Suspense, lazy} from "react";
import "./Project.scss";
import Button from "../../components/button/Button";
import {openSource, socialMediaLinks} from "../../portfolio";
import StyleContext from "../../contexts/StyleContext";
import Loading from "../../containers/loading/Loading";
export default function Projects() {
  const GithubRepoCard = lazy(() =>
    import("../../components/githubRepoCard/GithubRepoCard")
  );
  const FailedLoading = () => null;
  const renderLoader = () => <Loading />;
  const [repo, setrepo] = useState([]);
  // todo: remove useContex because is not supported
  const {isDark} = useContext(StyleContext);

  useEffect(() => {
    const getRepoData = () => {
      fetch("/profile.json")
        .then(result => {
          if (result.ok) {
            return result.json();
          }
          throw result;
        })
        .then(response => {
          setrepoFunction(response.data.user.pinnedItems.edges);
        })
        .catch(function (error) {
          console.error(
            `${error} (because of this error, nothing is shown in place of Projects section. Also check if Projects section has been configured)`
          );
          setrepoFunction("Error");
        });
    };
    getRepoData();
  }, []);

  function setrepoFunction(array) {
    setrepo(array);
  }
  if (
    openSource.display &&
    Array.isArray(repo) &&
    repo.length > 0 &&
    !(typeof repo === "string" || repo instanceof String)
  ) {
    return (
      <Suspense fallback={renderLoader()}>
        <div className="main" id="opensource">
          <h1 className="project-title">Open Source Projects</h1>
          <div className="repo-cards-div-main">
            {repo.map((v, i) => {
              if (!v) {
                console.error(
                  `Github Object for repository number : ${i} is undefined`
                );
              }
              return (
                <GithubRepoCard repo={v} key={v.node.id} isDark={isDark} />
              );
            })}
          </div>
          <Button
            text={"More Projects"}
            className="project-button"
            href={socialMediaLinks.github}
            newTab={true}
          />
        </div>
      </Suspense>
    );
  } else if (openSource.display && openSource.contributions && openSource.contributions.length > 0) {
    // Show PyPI or other contributions in a card layout matching GitHub repos
    return (
      <div className="main" id="opensource">
        <h1 className="project-title">Open Source Projects</h1>
        <div className="repo-cards-div-main">
          {openSource.contributions.map((contrib, i) => (
            <div className="dark-card-mode repo-card-div" key={i} onClick={() => window.open(contrib.url, '_blank') } style={{cursor: 'pointer'}}>
              <div className="repo-name-div">
                {/* PyPI icon styled like GitHub */}
                <svg aria-hidden="true" className="octicon repo-svg" height="20" role="img" viewBox="0 0 16 16" width="16"><circle cx="8" cy="8" r="8" fill="#3775A9"/><text x="8" y="12" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="Arial">PyPI</text></svg>
                <p className="repo-name">{contrib.name}</p>
              </div>
              <p className="repo-description">{contrib.description}</p>
              <div className="repo-stats">
                <div className="repo-left-stat">
                  <span>
                    <div className="language-color" style={{backgroundColor: '#3572A5'}}></div>
                    <p>Python</p>
                  </span>
                  {/* Example stats for PyPI, you can add more if available */}
                  <span>
                    <svg aria-hidden="true" className="octicon repo-star-svg" height="20" role="img" viewBox="0 0 10 16" width="12" fill="rgb(106, 115, 125)"><path fillRule="evenodd" d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"/></svg>
                    <p>PyPI</p>
                  </span>
                </div>
                <div className="repo-right-stat">
                  <a href={contrib.url} target="_blank" rel="noopener noreferrer" className="project-button">View on PyPI</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return <FailedLoading />;
  }
}
