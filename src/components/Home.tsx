import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
export function Home() {
  return (
    <Card>
      <CardContent>
        <p>
          Every night the list of packages is exported and then merged into a
          single CSV file that has every package version.
        </p>
        <p>
          The CSV has a column for the <code>pname</code>, the nix package name,
          the <code>name</code>, the <code>version</code> and the{' '}
          <code>sha</code> of the commit it was added.
        </p>
        <p>
          For example, to find which sha <code>go-15.10</code> appeared, you can
          run
        </p>
        <p>
          <code>
            curl -sSfL
            https://ahobson.github.io/nix-package-search/nix/nixpkgs-unstable/all_packages.csv
            | grep 'go-1.15.10'
          </code>
        </p>
        The result would look like
        <p>
          <code>
            go,go_1_15,go-1.15.10,1.15.10,674c39c08fb94d315cb9bc699da33fd1be4b4e2e
          </code>
        </p>
      </CardContent>
    </Card>
  )
}
