<?php

namespace App\Http\Traits;

use Illuminate\Database\Eloquent\Builder;

trait CanLoadRelationships
{
    /**
     * Relationship names this controller may eager-load.
     *
     * @return list<string>
     */
    abstract protected function relations(): array;

    /**
     * Eager-load allowed relationships.
     *
     * Uses optional `?include=rel1,rel2` query string. When omitted, all
     * {@see relations()} are loaded.
     */
    protected function loadRelationships(Builder $query): Builder
    {
        $allowed = $this->relations();
        $include = request()->query('include');

        if ($include === null || $include === '') {
            return $allowed === [] ? $query : $query->with($allowed);
        }

        $requested = array_filter(array_map('trim', explode(',', (string) $include)));
        $toLoad = array_values(array_intersect($allowed, $requested));

        return $toLoad === [] ? $query : $query->with($toLoad);
    }
}
